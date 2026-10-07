// @ts-check
import tsParser from '@typescript-eslint/parser'
import type { TSESLint } from '@typescript-eslint/utils'
import eslint from '@eslint/js'
import { importX } from 'eslint-plugin-import-x'
// @ts-ignore
import fpTs from 'eslint-plugin-fp-ts'
import rxjs from '@smarttools/eslint-plugin-rxjs'
import tseslint from 'typescript-eslint'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const fpTsFlatAll = fpTs.configs?.['flat/all'] as TSESLint.FlatConfig.Config | undefined

/**
 * Canonical plugin instances resolved by this package.
 * Framework configs (Next, Expo) run through `fixupConfigRules` which wraps
 * plugins in new objects, breaking ESLint's identity check (`!==`).
 * Use `normalizePlugins` to replace wrapped instances with these canonical ones.
 */
const canonicalPlugins: Record<string, TSESLint.FlatConfig.Plugin> = {
    '@typescript-eslint': tseslint.plugin as TSESLint.FlatConfig.Plugin,
    'import-x': importX as TSESLint.FlatConfig.Plugin,
}

/**
 * Walk an array of flat-config objects and replace any plugin registered under
 * a known key with the canonical instance from this package.
 * This prevents the ESLint "Cannot redefine plugin" error that occurs when
 * `fixupConfigRules` wraps a plugin into a different object reference.
 */
export function normalizePlugins(
    configs: TSESLint.FlatConfig.ConfigArray,
    extraPlugins?: Record<string, TSESLint.FlatConfig.Plugin>
): TSESLint.FlatConfig.ConfigArray {
    const knownPlugins = extraPlugins ? { ...canonicalPlugins, ...extraPlugins } : canonicalPlugins
    return configs.map(config => {
        if (!config.plugins) return config
        let changed = false
        const newPlugins: Record<string, TSESLint.FlatConfig.Plugin> = {}
        for (const [key, plugin] of Object.entries(config.plugins)) {
            if (key in knownPlugins && plugin !== knownPlugins[key]) {
                newPlugins[key] = knownPlugins[key]!
                changed = true
            } else {
                newPlugins[key] = plugin as TSESLint.FlatConfig.Plugin
            }
        }
        return changed ? { ...config, plugins: newPlugins } : config
    })
}

export const facileBase = tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    ...normalizePlugins([importX.flatConfigs.recommended, importX.flatConfigs.typescript]),
    eslintPluginPrettierRecommended,
    ...(fpTsFlatAll ? [fpTsFlatAll] : []),
    // @ts-ignore
    rxjs.configs.recommended,
    {
        plugins: {
            rxjs,
        },
        linterOptions: {
            reportUnusedDisableDirectives: 'off',
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                projectService: true,
                ecmaVersion: 2022,
            },
        },
        settings: {
            'import-x/resolver': {
                typescript: true,

                node: {
                    extensions: ['.js', '.ts', '.mjs', '.mts', '.jsx', '.tsx', '.json'],
                },
            },
        },

        rules: {
            complexity: 'off',
            curly: 'error',
            'default-case': 'off',
            'dot-notation': 'off',
            eqeqeq: 'error',
            'guard-for-in': 'error',
            'id-match': 'error',
            'no-bitwise': 'error',
            'no-console': 'error',
            'no-eq-null': 'error',
            'no-extend-native': 'error',
            'no-extra-bind': 'error',
            'no-implicit-coercion': 'error',
            'no-implicit-globals': 'off',
            'no-invalid-this': 'off',
            'no-lone-blocks': 'error',
            'no-global-assign': 'error',
            'no-nested-ternary': 'error',
            'no-new-func': 'error',
            'no-new-wrappers': 'error',
            'no-param-reassign': 'error',
            'no-redeclare': 'off',
            'no-shadow': 'off',
            'no-undef-init': 'error',
            'no-unused-vars': 'off',
            'no-useless-call': 'error',
            'no-useless-concat': 'error',
            'no-var': 'error',
            'no-void': 'error',

            'new-cap': [
                'error',
                {
                    newIsCap: true,
                    capIsNew: false,
                },
            ],

            'prefer-arrow-callback': 'error',
            'prefer-const': 'error',
            'prefer-rest-params': 'error',
            'prefer-template': 'error',
            'wrap-iife': ['error', 'inside'],
            '@typescript-eslint/dot-notation': 'error',
            '@typescript-eslint/no-namespace': 'warn',
            '@typescript-eslint/consistent-type-definitions': 'error',
            '@typescript-eslint/consistent-type-imports': 'error',
            '@typescript-eslint/no-empty-interface': 'off',
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/unified-signatures': 'error',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-require-imports': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',

            '@typescript-eslint/no-unused-vars': [
                'warn',
                {
                    argsIgnorePattern: '^_',
                    caughtErrorsIgnorePattern: '^_',
                    destructuredArrayIgnorePattern: '^_',
                    varsIgnorePattern: '^_',
                },
            ],

            '@typescript-eslint/no-shadow': [
                'error',
                {
                    hoist: 'all',
                    ignoreTypeValueShadow: true,
                },
            ],

            'prettier/prettier': 'error',
            'import-x/no-named-as-default': 'off',
            'import-x/no-named-as-default-member': 'off',
            'import-x/no-deprecated': 'off',
            'import-x/no-unresolved': 'off',
            'import-x/export': 'off',

            'import-x/order': [
                'error',
                {
                    groups: ['external', 'builtin', 'parent', 'sibling', 'index'],

                    pathGroups: [
                        {
                            pattern: '*.scss',
                            group: 'parent',
                            position: 'after',
                        },
                    ],

                    alphabetize: {
                        order: 'asc',
                    },
                },
            ],

            'import-x/no-duplicates': 'off',
            'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],

            'fp-ts/no-module-imports': 'off',
        },
    }
)

export default facileBase
