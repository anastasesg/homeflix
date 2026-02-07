import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import importPlugin from 'eslint-plugin-import';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
  ]),
  // Import ordering and cleanup rules
  eslintPluginPrettier,
  eslintConfigPrettier,
  {
    plugins: {
      import: importPlugin,
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // Import hygiene
      'import/first': 'error',
      'import/newline-after-import': 'error',
      'import/no-duplicates': 'error',

      // Import sorting - tailored for Next.js
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // React first
            ['^react$', '^react-dom$'],
            // Next.js
            ['^next(/.*)?$'],
            // External packages
            ['^@?\\w'],
            // Internal aliases (hooks, lib, etc.)
            ['^@/'],
            ['^@/components(/.*)?$'],
            // Parent imports
            ['^\\.\\.'],
            // Sibling and index imports
            ['^\\.'],
            // Side-effect imports
            ['^\\u0000'],
            // Style imports
            ['^.+\\.s?css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      // Unused imports - more aggressive than @typescript-eslint
      '@typescript-eslint/no-unused-vars': 'off',
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    ignores: ['./components/ui/*.tsx', './hooks/use-mobile.ts', './lib/utils.ts', '**/*.d.ts', '.worktrees/'],
  },
]);

export default eslintConfig;
