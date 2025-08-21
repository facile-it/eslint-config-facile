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
import react from 'eslint-config-facile/react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
    ...react,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname,
            },
        },
    },
]
```

### Next

_create eslint.config.mjs_

```ts
import next from 'eslint-config-facile/next'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
    ...next,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname,
            },
        },
    },
]
```

### Node

_create eslint.config.mjs_

```ts
import node from 'eslint-config-facile/node'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default [
    ...node,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: __dirname,
            },
        },
    },
]
```
