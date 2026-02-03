import { access, mkdir, readdir, readFile, writeFile } from 'fs/promises';
import openapiTypescript, { astToString } from 'openapi-typescript';
import path from 'path';

// =============================================================================
// Constants
// =============================================================================

const OPENAPI_DIR = path.join(__dirname, '../openapi');
const CLIENTS_DIR = path.join(__dirname, '../clients');
const VALID_EXTENSIONS = ['.json', '.yaml', '.yml'];

// =============================================================================
// ANSI Colors
// =============================================================================

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
} as const;

const fmt = {
  error: (msg: string) => `${colors.red}${colors.bold}error${colors.reset}${colors.red}: ${msg}${colors.reset}`,
  success: (msg: string) => `${colors.green}${colors.bold}✓${colors.reset} ${msg}`,
  info: (msg: string) => `${colors.blue}${colors.bold}info${colors.reset}: ${msg}`,
  warn: (msg: string) => `${colors.yellow}${colors.bold}warn${colors.reset}: ${msg}`,
  provider: (name: string) => `${colors.cyan}${name}${colors.reset}`,
  path: (p: string) => `${colors.dim}${p}${colors.reset}`,
};

// =============================================================================
// Help Text
// =============================================================================

const HELP_TEXT = `
${colors.bold}generate-api-client${colors.reset} - Generate TypeScript types from OpenAPI specifications

${colors.bold}USAGE${colors.reset}
  bun run scripts/generate-api-client.ts [options]

${colors.bold}OPTIONS${colors.reset}
  --all                 Generate clients for all OpenAPI specs in openapi/
  --provider=<name>     Generate client for a specific provider
  --list                List all available providers
  --dry-run             Show what would be generated without writing files
  --help, -h            Show this help message

${colors.bold}EXAMPLES${colors.reset}
  # Generate all clients
  bun run scripts/generate-api-client.ts --all

  # Generate client for a specific provider
  bun run scripts/generate-api-client.ts --provider=prowlarr

  # Preview what would be generated
  bun run scripts/generate-api-client.ts --all --dry-run

  # List available providers
  bun run scripts/generate-api-client.ts --list
`;

// =============================================================================
// Utilities
// =============================================================================

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(dirPath: string): Promise<void> {
  if (!(await fileExists(dirPath))) {
    await mkdir(dirPath, { recursive: true });
  }
}

function extractProviderName(filename: string): string {
  return filename.replace(/-openapi\.(json|yaml|yml)$/, '');
}

function isOpenApiFile(filename: string): boolean {
  return VALID_EXTENSIONS.some((ext) => filename.endsWith(`-openapi${ext}`));
}

async function getAvailableProviders(): Promise<string[]> {
  const files = await readdir(OPENAPI_DIR);
  return files.filter(isOpenApiFile).map(extractProviderName).sort();
}

function getOpenApiFilePath(provider: string): string | null {
  for (const ext of VALID_EXTENSIONS) {
    const filename = `${provider}-openapi${ext}`;
    return path.join(OPENAPI_DIR, filename);
  }
  return null;
}

async function findOpenApiFile(provider: string): Promise<string | null> {
  for (const ext of VALID_EXTENSIONS) {
    const filePath = path.join(OPENAPI_DIR, `${provider}-openapi${ext}`);
    if (await fileExists(filePath)) {
      return filePath;
    }
  }
  return null;
}

function getOutputPath(provider: string): string {
  return path.join(CLIENTS_DIR, provider, `${provider}-client.d.ts`);
}

// =============================================================================
// Commands
// =============================================================================

async function listProviders(): Promise<void> {
  const providers = await getAvailableProviders();

  if (providers.length === 0) {
    console.log(fmt.warn(`No OpenAPI specs found in ${fmt.path(OPENAPI_DIR)}`));
    return;
  }

  console.log(`\n${colors.bold}Available providers:${colors.reset}\n`);
  for (const provider of providers) {
    const outputPath = getOutputPath(provider);
    const hasClient = await fileExists(outputPath);
    const status = hasClient ? colors.green + '●' + colors.reset : colors.dim + '○' + colors.reset;
    console.log(`  ${status} ${fmt.provider(provider)}`);
  }
  console.log(`\n${colors.dim}● = client exists  ○ = no client${colors.reset}\n`);
}

async function generateClient(provider: string, dryRun: boolean): Promise<boolean> {
  const inputPath = await findOpenApiFile(provider);

  if (!inputPath) {
    console.error(fmt.error(`OpenAPI spec not found for provider "${provider}"`));
    console.error(`  Looked for: ${fmt.path(getOpenApiFilePath(provider) ?? '')}`);
    return false;
  }

  const outputPath = getOutputPath(provider);

  if (dryRun) {
    console.log(fmt.info(`Would generate ${fmt.path(outputPath)}`));
    console.log(`  ${colors.dim}from ${inputPath}${colors.reset}`);
    return true;
  }

  try {
    const spec = await readFile(inputPath, 'utf8');
    const ast = await openapiTypescript(spec);
    const types = astToString(ast);

    await ensureDir(CLIENTS_DIR);
    await writeFile(outputPath, types);

    console.log(fmt.success(`Generated ${fmt.provider(provider)} → ${fmt.path(path.basename(outputPath))}`));
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(fmt.error(`Failed to generate client for "${provider}": ${message}`));
    return false;
  }
}

async function generateAllClients(dryRun: boolean): Promise<void> {
  const providers = await getAvailableProviders();

  if (providers.length === 0) {
    console.log(fmt.warn(`No OpenAPI specs found in ${fmt.path(OPENAPI_DIR)}`));
    return;
  }

  const dryRunSuffix = dryRun ? ` ${colors.yellow}(dry run)${colors.reset}` : '';
  console.log(`\n${colors.bold}Generating TypeScript clients${colors.reset}${dryRunSuffix}\n`);

  let successCount = 0;
  let failureCount = 0;

  for (const provider of providers) {
    const success = await generateClient(provider, dryRun);
    if (success) {
      successCount++;
    } else {
      failureCount++;
    }
  }

  console.log();
  if (failureCount === 0) {
    console.log(fmt.success(`All ${successCount} clients generated successfully`));
  } else {
    console.log(fmt.warn(`Generated ${successCount} clients, ${failureCount} failed`));
  }
  console.log();
}

// =============================================================================
// CLI Argument Parsing
// =============================================================================

interface ParsedArgs {
  command: 'help' | 'list' | 'all' | 'provider';
  provider?: string;
  dryRun: boolean;
}

function parseArgs(args: string[]): ParsedArgs {
  const dryRun = args.includes('--dry-run');

  if (args.includes('--help') || args.includes('-h') || args.length === 0) {
    return { command: 'help', dryRun };
  }

  if (args.includes('--list')) {
    return { command: 'list', dryRun };
  }

  if (args.includes('--all')) {
    return { command: 'all', dryRun };
  }

  const providerArg = args.find((arg) => arg.startsWith('--provider='));
  if (providerArg) {
    const provider = providerArg.split('=')[1];
    if (!provider) {
      console.error(fmt.error('Provider name is required after --provider='));
      process.exit(1);
    }
    return { command: 'provider', provider, dryRun };
  }

  // Check for unknown flags
  const unknownFlags = args.filter((arg) => arg.startsWith('--') && !['--dry-run'].includes(arg));
  if (unknownFlags.length > 0) {
    console.error(fmt.error(`Unknown flag: ${unknownFlags[0]}`));
    console.error(`Run with --help for usage information`);
    process.exit(1);
  }

  return { command: 'help', dryRun };
}

// =============================================================================
// Main
// =============================================================================

async function main() {
  const parsed = parseArgs(process.argv.slice(2));

  switch (parsed.command) {
    case 'help':
      console.log(HELP_TEXT);
      break;

    case 'list':
      await listProviders();
      break;

    case 'all':
      await generateAllClients(parsed.dryRun);
      break;

    case 'provider':
      if (!parsed.provider) {
        console.error(fmt.error('Provider name is required'));
        process.exit(1);
      }
      const success = await generateClient(parsed.provider, parsed.dryRun);
      if (!success) {
        process.exit(1);
      }
      break;
  }
}

main().catch((error) => {
  console.error(fmt.error(error instanceof Error ? error.message : String(error)));
  process.exit(1);
});
