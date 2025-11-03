import { facileBase } from './index.mjs'
import tseslint from 'typescript-eslint'
// @ts-ignore
import expoConfig from 'eslint-config-expo/flat'

export default tseslint.config([expoConfig, facileBase])
