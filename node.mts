import base from './index.mjs'
// @ts-ignore
import globals from 'globals'
import tseslint from 'typescript-eslint'
import nodePlugin from 'eslint-plugin-n'

export default tseslint.config(base, nodePlugin.configs['flat/recommended-script'], {
    languageOptions: {
        globals: {
            ...globals.node,
        },

        ecmaVersion: 5,
        sourceType: 'module',
    },
    rules: {
        'n/no-unsupported-features/es-syntax': ['error', { ignores: ['modules'] }],
        'n/no-missing-import': 'off',
        'import/no-unresolved': 'error',
    },
})
