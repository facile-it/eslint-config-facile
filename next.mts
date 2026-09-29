import { fixupConfigRules } from '@eslint/compat'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import base, { normalizePlugins } from './index.mjs'
import reactHooksOff from './react-hooks-off.mjs'
import tseslint from 'typescript-eslint'

export default tseslint.config(
    ...normalizePlugins(fixupConfigRules(nextCoreWebVitals)),
    base,
    {
        rules: {
            'react/prop-types': 'off',
            'react/display-name': 'off',
            '@typescript-eslint/no-unused-expressions': 'warn',
        },
    },
    reactHooksOff
)
