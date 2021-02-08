export = {
    extends: ['./index.js', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
    rules: {
        'react/prop-types': 'off',
        'react/display-name': 'off',
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
