// @ts-check
import { FlatCompat } from "@eslint/eslintrc"
import { fixupConfigRules, fixupPluginRules } from "@eslint/compat"
import tsParser from '@typescript-eslint/parser'
import eslint from "@eslint/js";
// @ts-ignore
import importPlugin from "eslint-plugin-import";
// @ts-ignore
import fpTs from "eslint-plugin-fp-ts";
import rxjs from "@smarttools/eslint-plugin-rxjs"
import path from 'node:path'
import { fileURLToPath } from "node:url";
import tseslint from 'typescript-eslint';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: eslint.configs.recommended,
    allConfig: eslint.configs.all
})

export default tseslint.config(
    eslint.configs.recommended,
    tseslint.configs.recommended,
    importPlugin.flatConfigs.recommended,
    importPlugin.flatConfigs.typescript,
    eslintPluginPrettierRecommended,
    ...fixupConfigRules(compat.extends(
        "plugin:fp-ts/all",
    )),
    // @ts-ignore
    rxjs.configs.recommended,
    {
        plugins: {
            "fp-ts": fixupPluginRules(fpTs),
            rxjs,
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2019,
            sourceType: "module",
            parserOptions: {
                projectService: true,
                project: "./tsconfig.json",
                ecmaVersion: 2022
            },
        },
        settings: {
            "import/resolver": {
                typescript: true,

                node: {
                    extensions: [".ts", ".tsx", ".js", ".mjs", ".jsx", ".json"],
                },
            },
        },

        rules: {
            complexity: "off",
            curly: "error",
            "default-case": "off",
            "dot-notation": "off",
            eqeqeq: "error",
            "guard-for-in": "error",
            "id-match": "error",
            "no-bitwise": "error",
            "no-console": "error",
            "no-eq-null": "error",
            "no-extend-native": "error",
            "no-extra-bind": "error",
            "no-implicit-coercion": "error",
            "no-implicit-globals": "error",
            "no-invalid-this": "off",
            "no-lone-blocks": "error",
            "no-native-reassign": "error",
            "no-nested-ternary": "error",
            "no-new-func": "error",
            "no-new-wrappers": "error",
            "no-param-reassign": "error",
            "no-redeclare": "off",
            "no-shadow": "off",
            "no-undef-init": "error",
            "no-unused-vars": "off",
            "no-useless-call": "error",
            "no-useless-concat": "error",
            "no-var": "error",
            "no-void": "error",

            "new-cap": ["error", {
                newIsCap: true,
                capIsNew: false,
            }],

            "prefer-arrow-callback": "error",
            "prefer-const": "error",
            "prefer-rest-params": "error",
            "prefer-template": "error",
            "wrap-iife": ["error", "inside"],
            "@typescript-eslint/dot-notation": "error",
            "@typescript-eslint/no-namespace": "warn",
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/no-empty-interface": "off",
            "@typescript-eslint/explicit-function-return-type": "off",
            "@typescript-eslint/explicit-module-boundary-types": "off",
            "@typescript-eslint/no-explicit-any": "off",
            "@typescript-eslint/unified-signatures": "error",

            "@typescript-eslint/no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
            }],

            "@typescript-eslint/no-shadow": ["error", {
                hoist: "all",
                ignoreTypeValueShadow: true,
            }],

            "prettier/prettier": "error",
            "import/no-deprecated": "off",
            "import/no-unresolved": "off",
            "import/export": "off",

            "import/order": ["error", {
                groups: ["external", "builtin", "parent", "sibling", "index"],

                pathGroups: [{
                    pattern: "*.scss",
                    group: "parent",
                    position: "after",
                }],

                alphabetize: {
                    order: "asc",
                },
            }],

            "fp-ts/no-module-imports": "off",
        },
    }
)
