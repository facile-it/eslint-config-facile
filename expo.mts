import base, { normalizePlugins } from './index.mjs'
import tseslint from 'typescript-eslint'
// @ts-ignore
import expoConfig from 'eslint-config-expo/flat.js'
import { fixupConfigRules } from '@eslint/compat'

export default tseslint.config(...normalizePlugins(fixupConfigRules([...expoConfig])), base)
