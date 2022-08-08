export = {
    extends: ['./index.js', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
    rules: {
        'react/prop-types': 'off',
        'react/display-name': 'off',
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
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
