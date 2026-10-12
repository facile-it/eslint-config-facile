# ESlint-config-facile

facile.it ESLint & Prettier extensible configuration

## Installation

```sh
npm install -D eslint-config-facile eslint prettier
```

**Note** `eslint`, `prettier`, `typescript` are a peer dependencies

## Automated ESLint 10 migration

### Install the skill

A global installation is recommended because it leaves the consumer repository unchanged for the clean-worktree preflight:

```sh
npx skills add facile-it/eslint-config-facile@eslint-10-migration --global
```

For Devin CLI specifically, a non-interactive global install is:

```sh
npx skills add facile-it/eslint-config-facile@eslint-10-migration --global --agent devin --yes
```

To test a branch before it reaches the repository's default branch, pass the Git ref as a URL fragment (this also supports branch names containing `/`):

```sh
npx skills add "https://github.com/facile-it/eslint-config-facile.git#<branch>" \
  --skill eslint-10-migration --global --agent devin --yes
```

A project-local install is also supported, but it creates skill metadata in the consumer repository. Commit that installation separately before invoking the skill so the clean-worktree preflight can pass:

```sh
npx skills add facile-it/eslint-config-facile@eslint-10-migration
```

### Use the skill

1. Open Devin, Claude Code, or Cursor at the root of the consumer repository.
2. Confirm that `git status --short` is empty and that the repository uses npm, pnpm, or Yarn.
3. Invoke `/eslint-10-migration`, or ask the agent to use `eslint-10-migration` on the current repository.
4. Review and answer any explicit decision gates. The skill never pushes and leaves the migration diff for review.
5. Inspect the final report, `git status --short`, and `git diff` before deciding whether to commit the migration.

The skill inventories every workspace, migrates legacy and flat configurations to ESLint 10 and `eslint-config-facile@2.0.0-rc.0`, preserves custom scopes and rules, runs autofix, and reports all verification commands.

The migration requires a clean Git worktree and Node `^20.19.0 || ^22.13.0 || >=24`. When Node declarations are incompatible, the skill first presents an exact prerequisite-only update plan and asks whether it may apply and commit that plan without pushing. It proceeds only after explicit approval and a successful isolated commit; ambiguous or unverifiable Node upgrades remain blockers. npm, pnpm, and Yarn are supported; Bun and competing lockfiles are blockers. Application frameworks are never upgraded, and the skill stops for incompatible plugins, ambiguous configuration behavior, broad source rewrites, or removal of legacy config files requiring confirmation.

Devin Cloud does not inherit skills installed globally on a local machine. For Cloud use, keep the skill in the consumer repository or use a Cloud Playbook that reads this skill and its references from GitHub before operating on the consumer.

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
