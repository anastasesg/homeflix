/**
 * Architectural boundary specification.
 *
 * Layers are listed in dependency order (innermost first).
 * Each layer can only depend on layers defined BEFORE it.
 *
 * To add a module: add an entry to the relevant layer's `modules` object.
 * To change layer deps: update the layer's `deps` array.
 *
 * Free directories (not tracked, importable from anywhere):
 *   lib/, components/ui/, components/pwa/
 */

/** @type {Record<string, LayerSpec>} */
export const layers = {
  'api-types': {
    modules: {
      'api-types': 'api/types',
    },
  },

  utilities: {
    modules: {
      utilities: 'utilities',
    },
  },

  // Peer group: entities, mappers, and clients have circular Genre type dependencies.
  // They can import each other freely + api-types.
  'api-core': {
    modules: {
      'api-entities': 'api/entities',
      'api-mappers': 'api/mappers',
      'api-clients': 'api/clients',
    },
    deps: ['api-types'],
  },

  'api-utils': {
    modules: {
      'api-utils': 'api/utils',
    },
    deps: ['api-types', 'api-core'],
  },

  'api-functions': {
    modules: {
      'api-functions': 'api/functions',
    },
    deps: ['api-types', 'api-core', 'api-utils'],
  },

  'query-options': {
    modules: {
      'query-options': 'options/queries',
    },
    deps: ['api-types', 'api-core', 'api-functions'],
  },

  hooks: {
    modules: {
      hooks: 'hooks',
    },
    // hooks only use externals (nuqs, react) — no internal deps
  },

  context: {
    modules: {
      context: 'context',
    },
    // context only uses externals (react) — no internal deps
  },

  components: {
    modules: {
      'components-query': 'components/query',
      'components-media': 'components/media',
    },
    deps: ['api-types', 'api-core', 'hooks', 'context', 'utilities', 'query-options'],
  },

  app: {
    modules: {
      app: 'app',
    },
    deps: [
      'api-types',
      'api-core',
      'api-utils',
      'api-functions',
      'query-options',
      'hooks',
      'context',
      'components',
      'utilities',
    ],
  },
};

// ============================================================================
// Helpers
// ============================================================================

/** Collect all module types for a given layer. */
export function modulesOf(layerName) {
  return Object.keys(layers[layerName].modules);
}

/** Expand a list of layer names into all their module types. */
export function expandLayers(layerNames) {
  return layerNames.flatMap(modulesOf);
}

// ============================================================================
// ESLint rule generators
// ============================================================================

/**
 * Generate `boundaries/elements` from the spec.
 * Each module maps to a pattern using the @/ alias.
 */
export function buildElements() {
  const elements = [];
  for (const layer of Object.values(layers)) {
    for (const [type, pattern] of Object.entries(layer.modules)) {
      elements.push({ type, pattern: [pattern] });
    }
  }
  return elements;
}

/**
 * Generate `boundaries/element-types` rules.
 * Each module can import its layer deps + its siblings within the same layer.
 */
export function buildElementTypeRules() {
  const rules = [];

  for (const [layerName, layer] of Object.entries(layers)) {
    const depTypes = expandLayers(layer.deps || []);
    const allSiblings = modulesOf(layerName);

    for (const mod of allSiblings) {
      rules.push({
        from: [mod],
        allow: [...depTypes, ...allSiblings],
      });
    }
  }

  return rules;
}

/**
 * Generate `simple-import-sort` groups from layer order.
 *
 * Groups:
 * 1. React/React DOM
 * 2. Next.js
 * 3. External packages
 * 4. Each internal layer in dependency order (innermost first)
 * 5. Relative imports
 * 6. Side-effect imports
 * 7. Style imports
 */
export function buildImportSortGroups() {
  // Collect all top-level directory prefixes from layer patterns
  const layerPrefixes = [];
  for (const layer of Object.values(layers)) {
    for (const pattern of Object.values(layer.modules)) {
      const topDir = pattern.split('/')[0];
      if (!layerPrefixes.includes(topDir)) {
        layerPrefixes.push(topDir);
      }
    }
  }

  // Build the internal groups — one per unique top-level directory, in layer order
  const internalGroups = layerPrefixes.map((dir) => [`^@/${dir}(/.*)?$`]);

  return [
    // React first
    ['^react$', '^react-dom$'],
    // Next.js
    ['^next(/.*)?$'],
    // External packages (anything not starting with @/ or ./)
    ['^@?\\w'],
    // Internal layers in dependency order
    ...internalGroups,
    // Free directories (lib, components/ui, components/pwa) — caught by a general @/ group
    ['^@/lib(/.*)?$'],
    ['^@/components/ui(/.*)?$'],
    // Parent imports
    ['^\\.\\.'],
    // Sibling and index imports
    ['^\\.'],
    // Side-effect imports
    ['^\\u0000'],
    // Style imports
    ['^.+\\.s?css$'],
  ];
}

/**
 * @typedef {{
 *   modules: Record<string, string>;
 *   deps?: string[];
 * }} LayerSpec
 */
