# ESlint-config-facile

facile.it ESLint extensible configuration

---

### Installation

```sh
yarn add eslint-config-facile
```

**Note** `eslint`, `prettier`, `typescript` are a peer dependencies

---

### TypeScript

```json
// in your .eslintrc.json

{
  "extends": "facile",
  "parserOptions": {
      "project": "./tsconfig.json"
  }
}
```

---

### React

```json
// in your .eslintrc.json

{
  "extends": "facile/react",
  "parserOptions": {
      "project": "./tsconfig.json"
  }
}
```

---

### Node

```json
// in your .eslintrc.json

{
  "extends": "facile/node"
  "parserOptions": {
      "project": "./tsconfig.json"
  }
}
```
