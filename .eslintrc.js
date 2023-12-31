module.exports = {
    root: true,
    parserOptions: {
        parser: '@babel/eslint-parser',
        ecmaVersion: 2017,
        sourceType: 'module',
        allowImportExportEverywhere: true
    },
    extends: [
        // 'standard',
        "eslint:recommended",
        "prettier"
    ],
    plugins: [],
    env: {
        browser: true,
        es6: true,
        node: true,
    },
    ignorePatterns: [
        "node_modules/",
        "dist/",
        "!.*",
        "packages/demo/"
    ]
}