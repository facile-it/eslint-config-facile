export = {
    extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended', './index.js'],
    rules: {
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'react/jsx-curly-brace-presence': 'error',
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    env: {
        browser: true,
    },
}
