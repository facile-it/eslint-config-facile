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

_create .eslintrc.json_

```json
{
    "extends": "facile/react",
    "parserOptions": {
        "project": "./tsconfig.json"
    }
}
```

### Next

_create .eslintrc.json_

```json
{
    "extends": "facile/next",
    "parserOptions": {
        "project": "./tsconfig.json"
    }
}
```

### Node

_create .eslintrc.json_

```json
{
    "extends": "facile/node",
    "parserOptions": {
        "project": "./tsconfig.json"
    }
}
```
