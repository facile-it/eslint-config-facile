import { fixupConfigRules } from '@eslint/compat'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import { facileBaseCore } from './index.mjs'
import reactHooksOff from './react-hooks-off.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    ...fixupConfigRules(nextCoreWebVitals),
    {
        files: ['**/*.mts'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
    },
    facileBaseCore,
    {
        rules: {
            'react/prop-types': 'off',
            'react/display-name': 'off',
            '@typescript-eslint/no-unused-expressions': 'warn',
        },
    },
    reactHooksOff
)
