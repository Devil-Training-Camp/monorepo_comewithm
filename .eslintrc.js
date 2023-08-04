module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2017,
    sourceType: 'module',
    allowImportExportEverywhere: true,
  },
  extends: [
    // 'standard',
    'eslint:recommended',
    'prettier',
  ],
  plugins: ['@typescript-eslint'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  ignorePatterns: ['node_modules/', 'dist/', '!.*', 'packages/demo/'],
};
