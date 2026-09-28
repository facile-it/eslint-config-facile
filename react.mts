import { fixupPluginRules } from '@eslint/compat'
import globals from 'globals'
import base from './index.mjs'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactHooksOff from './react-hooks-off.mjs'

const react = fixupPluginRules(reactPlugin)

export default tseslint.config(
    base,
    { ...reactPlugin.configs.flat.recommended, plugins: { react } },
    reactHooks.configs.flat['recommended-latest'],
    reactHooksOff,
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },

        settings: {
            react: {
                version: 'detect',
            },
        },

        rules: {
            'react/prop-types': 'off',
            'react/display-name': 'off',
            'react/jsx-uses-react': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/jsx-curly-brace-presence': 'error',
        },
    }
)
