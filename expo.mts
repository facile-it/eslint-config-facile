import { facileBaseCore } from './index.mjs'
import tseslint from 'typescript-eslint'
// @ts-ignore
import expoConfig from 'eslint-config-expo/flat.js'
import { fixupConfigRules } from '@eslint/compat'

export default tseslint.config(
    ...fixupConfigRules([...expoConfig]),
    {
        files: ['**/*.mts'],
        plugins: {
            '@typescript-eslint': tseslint.plugin,
        },
    },
    facileBaseCore
)
