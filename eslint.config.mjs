import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);
const compat = new FlatCompat({
  baseDirectory: dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...compat.extends(
    'airbnb-base',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended',
  ),
  {
    plugins: {
      '@typescript-eslint': typescriptEslint,
      prettier,
    },

    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
      },

      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
    },

    settings: {
      'import/resolver': {
        typescript: {},
      },
    },

    rules: {
      'prettier/prettier': 'error',
      'class-methods-use-this': 'off',
      '@typescript-eslint/camelcase': 'off',
      'no-useless-constructor': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '_',
        },
      ],

      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'interface',
          format: ['PascalCase'],
          prefix: ['I'],
        },
      ],

      'import/extensions': [
        'error',
        'ignorePackages',
        {
          ts: 'never',
        },
      ],
      'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
      'no-empty-function': ['error', { allow: ['constructors'] }],
    },
  },
];
