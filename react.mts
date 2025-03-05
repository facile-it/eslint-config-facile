import { fixupConfigRules } from "@eslint/compat";
import globals from "globals";
import js from "@eslint/js";
import base from './index.mjs'
import { FlatCompat } from "@eslint/eslintrc";
import path from 'node:path'
import { fileURLToPath } from "node:url";
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default tseslint.config(
    ...base,
    ...fixupConfigRules(
        compat.extends(
            "plugin:react/recommended",
            "plugin:react-hooks/recommended"
        ),
), {
    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },

    settings: {
        react: {
            version: "detect",
        },
    },

    rules: {
        "react/prop-types": "off",
        "react/display-name": "off",
        "react/jsx-uses-react": "off",
        "react/react-in-jsx-scope": "off",
        "react/jsx-curly-brace-presence": "error",
    },
})
