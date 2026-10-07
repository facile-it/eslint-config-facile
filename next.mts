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
            // eslint-config-next still pulls in eslint-plugin-import (legacy); disable
            // its rules so they don't clash with the import-x equivalents from base.
            'import/no-unresolved': 'off',
        },
    },
    reactHooksOff
)
