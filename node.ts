export = {
    plugins: ['node'],
    extends: ['plugin:node/recommended', './index.js'],
    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
        'node/no-missing-import': 'off',
        'import/no-unresolved': 'error',
    },
    env: {
        node: true,
    },
}
