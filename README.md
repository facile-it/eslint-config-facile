# ESlint-config-facile

facile.it ESLint & Prettier extensible configuration

## Installation

```sh
npm install -D eslint-config-facile eslint prettier
```

**Note** `eslint`, `prettier`, `typescript` are a peer dependencies

## Prettier config

_create .prettierrc.js_

```js
module.exports = require('eslint-config-facile/prettierrc.json')
```

## ESLint config

### React

_create eslint.config.mjs_

```ts
import { defineConfig } from 'eslint/config'
import react from 'eslint-config-facile/react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig([
    react,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname, // or only import.meta.dirname, available after Node.js v20.11.0
            },
        },
    },
])
```

### Expo

_create eslint.config.mjs_

```ts
import { defineConfig } from 'eslint/config'
import expo from 'eslint-config-facile/expo'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig([
    expo,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname, // or only import.meta.dirname, available after Node.js v20.11.0
            },
        },
    },
])
```

### Next

_create eslint.config.mjs_

```ts
import { defineConfig } from 'eslint/config'
import next from 'eslint-config-facile/next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig([
    next,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname, // or only import.meta.dirname, available after Node.js v20.11.0
            },
        },
    },
])
```

### Node

_create eslint.config.mjs_

```ts
import { defineConfig } from 'eslint/config'
import node from 'eslint-config-facile/node'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig([
    node,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname, // or only import.meta.dirname, available after Node.js v20.11.0
            },
        },
    },
])
```

## Technical debt and known limitations

- **ESLint 10 compatibility**: this package declares `eslint@^9.33.0 || ^10.0.0` as a peer dependency. React/Next/Expo support on ESLint 10 relies on `@eslint/compat` because upstream plugins (notably `eslint-plugin-react` and the configs shipped by `eslint-config-next`/`eslint-config-expo`) do not yet declare ESLint 10 support. Once those plugins are updated, the `@eslint/compat` shims can be removed.
- **`npm overrides`**: the `overrides` field in `package.json` forces a single `eslint` version on plugins whose peer declarations have not been updated yet (`eslint-plugin-import`, `eslint-plugin-jsx-a11y`, `eslint-plugin-react`, `eslint-plugin-react-hooks`). `eslint-plugin-import` is no longer used directly (replaced by `eslint-plugin-import-x`) but is still pulled in transitively by `eslint-config-next` and `eslint-config-expo`. All overrides should be removed when each plugin officially supports ESLint 10.
- **Plugin dedup via `normalizePlugins`**: `fixupConfigRules` wraps plugin objects in new instances, which breaks ESLint's `plugins` identity check ("Cannot redefine plugin"). `normalizePlugins` in `index.mts` rewrites wrapped plugins back to the canonical instances resolved by this package. It can be removed together with `@eslint/compat` once upstream configs support ESLint 10 natively.
- **`eslint-config-facile/next` requires `next`**: `eslint-config-next` loads `next/dist/compiled/babel/eslint-parser`, so `next` must be installed in the consumer project.
