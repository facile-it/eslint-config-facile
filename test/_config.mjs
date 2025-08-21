import base from '../dist/index.mjs'
import { join } from "path";
import path from 'node:path'
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default [
    {
        ignores: ['**/*.mjs'],
    },
    ...base,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname,
                project: './tsconfig.json',
            },
        },
    },
]
