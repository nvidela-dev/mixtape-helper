module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb',
    'airbnb-typescript',
    'airbnb/hooks',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // React 17+ doesn't require React import
    'react/react-in-jsx-scope': 'off',

    // Allow JSX in .tsx files
    'react/jsx-filename-extension': ['error', { extensions: ['.tsx'] }],

    // Next.js handles exports
    'import/prefer-default-export': 'off',

    // TypeScript handles file extensions
    'import/extensions': 'off',

    // We use default parameter values instead of defaultProps
    'react/require-default-props': 'off',

    // Allow function declarations and arrow functions
    'react/function-component-definition': ['error', {
      namedComponents: 'function-declaration',
      unnamedComponents: 'arrow-function',
    }],

    // Prop spreading is useful in React
    'react/jsx-props-no-spreading': 'off',

    // Allow unescaped entities in JSX
    'react/no-unescaped-entities': 'off',

    // Consistent return not always needed
    'consistent-return': 'off',

    // Allow console for debugging (warn instead of error)
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    // Allow void for fire-and-forget promises
    '@typescript-eslint/no-floating-promises': 'off',

    // Prefer interfaces over types where possible, but don't enforce
    '@typescript-eslint/consistent-type-definitions': 'off',

    // Allow any in specific cases (keep as warning)
    '@typescript-eslint/no-explicit-any': 'warn',

    // Maximum line length
    'max-len': ['error', {
      code: 120,
      ignoreStrings: true,
      ignoreTemplateLiterals: true,
      ignoreComments: true,
    }],

    // No unused vars (allow underscore prefix)
    '@typescript-eslint/no-unused-vars': ['error', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],

    // Allow named exports from files with single export
    'import/no-named-as-default': 'off',

    // Import ordering
    'import/order': ['error', {
      groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
      'newlines-between': 'never',
    }],

    // JSX expressions per line - too strict for practical use
    'react/jsx-one-expression-per-line': 'off',

    // Allow nested ternaries for conditional rendering
    'no-nested-ternary': 'off',

    // Object curly newlines - allow single line for short objects
    'object-curly-newline': ['error', {
      ObjectExpression: { multiline: true, consistent: true },
      ObjectPattern: { multiline: true, consistent: true },
      ImportDeclaration: { multiline: true, consistent: true },
      ExportDeclaration: { multiline: true, consistent: true },
    }],

    // Media elements - video preview doesn't need captions
    'jsx-a11y/media-has-caption': 'off',

    // Label association - we use labels correctly with nested inputs
    'jsx-a11y/label-has-associated-control': ['error', {
      assert: 'either',
      depth: 3,
    }],
  },
};
