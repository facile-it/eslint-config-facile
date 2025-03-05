import { FlatCompat } from "@eslint/eslintrc"
import js from "@eslint/js";
import base from './index.mjs'
import { fixupConfigRules } from '@eslint/compat';
// @ts-ignore
import node from 'eslint-plugin-node'
import globals from "globals";
import path from 'node:path'
import { fileURLToPath } from "node:url";
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
})

export default tseslint.config(
    ...base,
    ...fixupConfigRules(compat.extends(
        'plugin:node/recommended',
    )),
    {
        plugins: {
            node,
        },
        languageOptions: {
            globals: {
                ...globals.node,
            },

            ecmaVersion: 5,
            sourceType: "module",
        },
        rules: {
            'node/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
            'node/no-missing-import': 'off',
            'import/no-unresolved': 'error',
        },
    }
)
