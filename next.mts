import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import { facileBase } from './index.mjs'
import { fixupConfigRules } from '@eslint/compat'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tseslint from 'typescript-eslint'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all,
})

export default tseslint.config(...fixupConfigRules(compat.extends('next/core-web-vitals')), facileBase, {
    rules: {
        'react/prop-types': 'off',
        'react/display-name': 'off',
    },
})
