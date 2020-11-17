export = {
    plugins: ['node'],
    extends: ['./index.js', 'plugin:node/recommended'],
    parserOptions: {
        sourceType: 'module',
    },
    rules: {
        'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
        'node/no-missing-import': ['error', { tryExtensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] }],
    },
    env: {
        node: true,
    },
}
