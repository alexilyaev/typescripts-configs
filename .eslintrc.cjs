const { readGitignoreFiles } = require('eslint-gitignore');

const libsOrder = [
  // Prevent Prettier single line collapse
  'zod',
  'zod-form-data',
  'date-fns/**',
  'date-fns-tz/**',
].map((identifier) => ({
  pattern: identifier,
  group: 'external',
  position: 'before',
}));
const importOrderPathGroups = [
  // Force a specific order for specific libraries
  ...libsOrder,
];

/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    // https://github.com/alexilyaev/eslint-config-ai/blob/master/base.js
    'ai',
    'ai/unicorn',
    'ai/import',
    'ai/eslint-comments',
    'ai/last',
  ],
  overrides: [
    // TypeScript files
    {
      files: ['*.{ts,tsx}'],
      extends: [
        'plugin:@typescript-eslint/recommended-type-checked',
        'plugin:@typescript-eslint/stylistic-type-checked',
      ],
      plugins: ['@typescript-eslint'],
      parserOptions: {
        project: true,
      },
      rules: {
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/consistent-type-imports': [
          'warn',
          {
            prefer: 'type-imports',
            fixStyle: 'inline-type-imports',
          },
        ],
        '@typescript-eslint/no-unused-vars': [
          'warn',
          {
            argsIgnorePattern: '^_',
          },
        ],
        '@typescript-eslint/require-await': 'off',
        '@typescript-eslint/no-misused-promises': [
          'error',
          {
            checksVoidReturn: {
              attributes: false,
            },
          },
        ],

        /**
         * eslint-plugin-import
         *
         * @see
         * https://github.com/benmosher/eslint-plugin-import
         */
        'import/order': [
          1,
          {
            groups: [
              'builtin',
              'external',
              'internal',
              'parent',
              'sibling',
              'index',
              'unknown',
            ],
            pathGroups: importOrderPathGroups,
            pathGroupsExcludedImportTypes: ['builtin'],
            'newlines-between': 'never',
          },
        ],
        // https://eslint.org/docs/latest/rules/no-restricted-imports
        'no-restricted-imports': [
          'warn',
          {
            patterns: [
              {
                group: ['*.js'],
                message: 'Import extensions are not allowed',
              },
            ],
            paths: [
              {
                name: 'lodash',
                message: `Please use "import foo from 'lodash/foo'"`,
              },
              {
                name: 'lodash/isArray',
                message: 'Please use `Array.isArray` instead',
              },
              {
                name: 'date-fns',
                message: `Please use "import { something } from 'date-fns/something'"`,
              },
              {
                name: 'date-fns-tz',
                message: `Please use "import { something } from 'date-fns-tz/something'"`,
              },
            ],
          },
        ],
      },
    },

    // These files should be treated as Node scripts
    {
      files: [
        '.*.{js,cjs,ts,mts}',
        '*.config.{js,cjs,ts,mts}',
        '.storybook/**/*.{js,ts}',
        // Specific to this project
        'lint-staged/**/*.{js,ts}',
      ],
      env: {
        node: true,
      },
      rules: {
        'import/no-default-export': 'off',
      },
    },
  ],
  ignorePatterns: [
    // Add all patterns from `.gitignore` that's relative to `process.cwd()`
    ...readGitignoreFiles(),
  ],
};
