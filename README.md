# ESlint-config-facile

facile.it ESLint & Prettier extensible configuration

---

## Installation

```sh
npm install -D eslint-config-facile eslint prettier
```

**Note** `eslint`, `prettier`, `typescript` are a peer dependencies

---

## Config

### Eslint

#### React

##### Simple use

_ in your package.json_

```json
"eslintConfig": {
    "extends": "facile/react",
    "parserOptions": {
        "project": "./tsconfig.json"
    }
}
```

##### Extend

_.eslintrc.json_

```json
{
    "extends": "facile/react",
    "parserOptions": {
        "project": "./tsconfig.json"
    }
}
```

#### Node

##### Simple use

_ in your package.json_

```json
"eslintConfig": {
    "extends": "facile/node",
    "parserOptions": {
        "project": "./tsconfig.json"
    }
}
```

##### Extend

_.eslintrc.json_

```json
{
    "extends": "facile/node",
    "parserOptions": {
        "project": "./tsconfig.json"
    }
}
```

### Prettier

##### Simple use

_ in your package.json_

```json
"prettier": "eslint-config-facile/prettierrc.json",
```

##### Extend

_.prettierrc.js_

```js
module.exports = {
    ...require('eslint-config-facile/prettierrc.json'),
    // custom config
}
```
