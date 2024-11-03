import globals from 'globals';
import js from '@eslint/js';
import react from 'eslint-plugin-react';

export default [
  { ignores: ['dist'] },
  {
    files: [
      'react/**/*.{js,jsx}',
      'server/**/*.{js,jsx}'
    ],
    plugins: {
      react,
    },
    languageOptions: {
      ecmaVersion: 2024,
      globals: {
        ...globals.browser,
        process: 'readonly',
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module',
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,

      // Basic Errors
      'no-console': 'warn',
      'no-debugger': 'error',
      'no-unused-vars': 'error',
      'no-undef': 'error',
      'no-unreachable': 'error',
      'comma-dangle': 'error',
      'no-cond-assign': 'error',
      'no-constant-condition': 'error',
      'no-control-regex': 'error',
      'no-delete-var': 'error',
      'no-dupe-args': 'error',
      'no-dupe-keys': 'error',
      'no-duplicate-case': 'error',
      'no-empty': 'error',
      'no-empty-character-class': 'error',
      'no-ex-assign': 'error',
      'no-extra-boolean-cast': 'error',
      'no-extra-semi': 'error',
      'no-func-assign': 'error',
      'no-inner-declarations': 'error',
      'no-invalid-regexp': 'error',
      'no-irregular-whitespace': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      'no-negated-in-lhs': 'error',
      'no-obj-calls': 'error',
      'no-octal': 'error',
      'no-redeclare': 'error',
      'no-regex-spaces': 'error',
      'no-sparse-arrays': 'error',
      'no-unexpected-multiline': 'error',
      'use-isnan': 'error',
      'valid-typeof': 'error',

      // Best Practices
      'curly': 'error',
      'eqeqeq': ['error', 'always'],
      'no-eval': 'error',
      'radix': 'error',
      'block-scoped-var': 'error',
      'dot-location': ['error', 'property'],
      'dot-notation': 'error',
      'no-alert': 'error',
      'no-caller': 'error',
      'no-labels': 'error',
      'no-extra-bind': 'error',
      'no-floating-decimal': 'error',
      'no-implied-eval': 'error',
      'no-lone-blocks': 'error',
      'no-loop-func': 'error',
      'no-multi-spaces': 'error',
      'no-self-compare': 'error',
      'no-throw-literal': 'error',
      'no-unused-expressions': 'error',
      'no-useless-call': 'error',
      'no-useless-concat': 'error',
      'no-with': 'error',
      'yoda': ['error', 'never'],

      // Strict Mode
      'strict': ['error', 'global'],

      // Variables
      'no-use-before-define': ['error', { functions: false }],
      'no-catch-shadow': 'error',
      'no-label-var': 'error',
      'no-shadow-restricted-names': 'error',
      'no-shadow': 'error',
      'no-use-before-define': ['error', 'nofunc'],

      // Style
      'indent': ['error', 4, { SwitchCase: 1 }],
      'quotes': ['error', 'single', { avoidEscape: true }],
      'semi': ['error', 'always'],
      'linebreak-style': ['error', 'unix'],
      'array-bracket-spacing': ['error', 'never'],
      'brace-style': ['error', '1tbs'],
      'camelcase': ['error', { 'properties': 'always' }],
      'comma-spacing': 'error',
      'comma-style': ['error', 'last'],
      'consistent-this': ['warn', 'self'],
      'eol-last': 'error',
      'key-spacing': 'error',
      'new-cap': ['error', { 'capIsNewExceptions': ['Component', 'Route', 'Map'] }],
      'no-array-constructor': 'error',
      'no-multiple-empty-lines': 'error',
      'no-nested-ternary': 'error',
      'no-spaced-func': 'error',
      'no-trailing-spaces': 'error',
      'no-unneeded-ternary': 'error',
      'object-curly-spacing': 'error',
      'semi-spacing': 'error',
      'keyword-spacing': 'error',
      'space-before-blocks': 'error',
      'space-before-function-paren': ['error', { 'anonymous': 'always', 'named': 'never' }],
      'space-in-parens': ['error', 'never'],
      'space-infix-ops': 'error',
      'space-unary-ops': 'error',

      // Node.js and CommonJS
      'no-mixed-requires': 'error',
      'no-path-concat': 'error',

      // ECMAScript 6
      'no-var': 'error',
      'prefer-const': 'error',
      'no-const-assign': 'error',

      // React/JSX
      'react/display-name': 'error',
      'react/jsx-curly-spacing': 'warn',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unknown-property': ['error', { 'ignore': ['class'] }],
      'react/sort-comp': 'error',
      'jsx-quotes': ['error', 'prefer-single'],

      // Warnings
      'complexity': ['error', 20],

      // Disable
      'no-underscore-dangle': 'off',
    },
  },
]
