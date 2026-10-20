import base, { normalizePlugins } from './index.mjs'
import tseslint from 'typescript-eslint'
// @ts-ignore
import expoConfig from 'eslint-config-expo/flat.js'
import { fixupConfigRules } from '@eslint/compat'

export default tseslint.config(...normalizePlugins(fixupConfigRules([...expoConfig])), base, {
    rules: {
        // eslint-config-expo still pulls in eslint-plugin-import (legacy); disable
        // its rules so they don't clash with the import-x equivalents from base.
        'import/no-unresolved': 'off',
    },
})
