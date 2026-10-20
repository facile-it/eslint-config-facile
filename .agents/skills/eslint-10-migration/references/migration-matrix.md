# Migration matrix

Use this matrix only after completing the preflight and baseline in `SKILL.md`.

## Package-manager operations

The commands below save both migration dependencies exactly so the first run is reproducible; `eslint-config-facile` must always remain on the exact target from `target.md`. If repository policy requires a range for ESLint, update both dependencies together first, then use a second package-manager operation to restore only the ESLint range without changing the resolved lockfile version. Scope operations to every manifest that directly owns the dependency.

| Manager | Update operation                                                                     |
| ------- | ------------------------------------------------------------------------------------ |
| npm     | `npm install --save-dev --save-exact eslint-config-facile@2.0.0-rc.0 eslint@^10.0.0` |
| pnpm    | `pnpm add --save-dev --save-exact eslint-config-facile@2.0.0-rc.0 eslint@^10.0.0`    |
| Yarn    | `yarn add --dev --exact eslint-config-facile@2.0.0-rc.0 eslint@^10.0.0`              |

For pnpm, merge the following into the root manifest before running the update operation (preserve all existing `pnpm` settings):

```json
{
    "pnpm": {
        "peerDependencyRules": {
            "allowedVersions": {
                "eslint": "10"
            }
        }
    }
}
```

Some upstream plugins used by the shared config are compatible through its shims but still publish peer ranges that exclude ESLint 10. This setting tells pnpm to accept ESLint 10 for those peer relationships; it does not override or select the installed ESLint version.

The `pnpm.peerDependencyRules` block is pnpm-specific. For npm, merge these overrides into the root manifest before the update operation; overrides declared by a dependency are not inherited by its consumer:

```json
{
    "overrides": {
        "eslint-plugin-import": {
            "eslint": "$eslint"
        },
        "eslint-plugin-jsx-a11y": {
            "eslint": "$eslint"
        },
        "eslint-plugin-react": {
            "eslint": "$eslint"
        },
        "eslint-plugin-react-hooks": {
            "eslint": "$eslint"
        }
    }
}
```

The npm overrides make those plugins use the consumer's declared ESLint version. Preserve all existing root `overrides` when merging them. Yarn has no direct equivalent that replaces an already-declared peer range: peer-range warnings are expected and are not blockers. Do not add `resolutions`, ineffective `packageExtensions`, or broad log filters merely to hide them. If an existing strict peer-dependency policy makes the update exit non-zero, stop and report the exact error instead of forcing installation or weakening repository policy.

Add Prettier or TypeScript to the same operation only when their current versions fall outside the ranges in `target.md`. Use workspace-root flags only when the repository's existing ownership requires them. Do not invent a workspace root dependency when individual workspaces own the tooling.

## Facile preset mappings

| Legacy `extends` or flat import                | Target entry point           |
| ---------------------------------------------- | ---------------------------- |
| `facile` or `eslint-config-facile`             | `eslint-config-facile`       |
| `facile/node` or `eslint-config-facile/node`   | `eslint-config-facile/node`  |
| `facile/react` or `eslint-config-facile/react` | `eslint-config-facile/react` |
| `facile/next` or `eslint-config-facile/next`   | `eslint-config-facile/next`  |
| `facile/expo` or `eslint-config-facile/expo`   | `eslint-config-facile/expo`  |

Minimal target shape:

```js
import { defineConfig } from 'eslint/config'
import facile from 'eslint-config-facile'

export default defineConfig([
    facile,
    {
        languageOptions: {
            parserOptions: {
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
])
```

Use the runtime-compatible `fileURLToPath`/`dirname` form instead of `import.meta.dirname` if the consumer's supported Node range includes versions before Node 20.11.

## Legacy-to-flat property mappings

| Legacy property                    | Flat-config representation                      | Guardrail                                                                                                                                                   |
| ---------------------------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ignorePatterns` / `.eslintignore` | leading config object with `ignores`            | Preserve ordering/negation; convert basename-only patterns such as `temp.js` to `**/temp.js`; add `**/.*` only if dotfiles were effectively ignored before. |
| `overrides[].files`                | ordered object with `files`                     | Rebase globs relative to the new config file and preserve override order.                                                                                   |
| `overrides[].excludedFiles`        | `ignores` on the same scoped object             | Verify the effective file set with representative files.                                                                                                    |
| `rules`                            | `rules`                                         | Preserve severity and options. Never disable a rule merely to pass.                                                                                         |
| `settings`                         | `settings`                                      | Preserve plugin settings; apply React major rule below.                                                                                                     |
| `parserOptions`                    | `languageOptions.parserOptions`                 | Do not combine `project` and inherited `projectService` mechanically.                                                                                       |
| `parser`                           | `languageOptions.parser`                        | Import the parser object; verify ESLint 10 compatibility.                                                                                                   |
| `plugins: ['name']`                | `plugins: { name: pluginObject }`               | Import a compatible plugin object; stop if its flat use is unverified.                                                                                      |
| `env`                              | `languageOptions.globals` plus language options | Preserve the exact globals and writability, using a compatible `globals` package when needed.                                                               |
| `globals`                          | `languageOptions.globals`                       | Convert legacy booleans to `readonly`/`writable` semantics without broadening access.                                                                       |
| `processor`                        | `processor`                                     | Verify the owning plugin supports ESLint 10 flat config.                                                                                                    |
| `eslintConfig`                     | same mappings in a config file                  | Remove the manifest field only after the replacement loads.                                                                                                 |

## Nested configuration

A legacy child config inherits parent configuration by directory cascade. Recreate that behavior in root flat config in this order:

1. global ignores;
2. root Facile preset and root customizations;
3. parent scoped customizations;
4. child scoped preset/customizations;
5. narrower overrides.

Prefix child patterns with the child path. Do not create an independent child config unless the workspace already has an autonomous lint command and config boundary; otherwise a separate config can silently change root lint coverage.

## TypeScript project service

- Preserve `tsconfigRootDir` at the scope where it was effective.
- If legacy `project` points to the default project discoverable from each linted file, omit `project` and validate inherited `projectService` with lint.
- If config files or other out-of-project files require support, use an ESLint-supported `projectService.allowDefaultProject` pattern only when narrow and verified.
- Multiple project globs, project references, workspace-relative roots, and broad out-of-project patterns are decision gates. Stop unless representative lint proves equivalence.

## Plugin migration

- For direct `eslint-plugin-import` usage, inventory every `import/*` rule/config first. Rename a custom rule to `import-x/<same-rule>` only after confirming that rule and its options exist in the installed `eslint-plugin-import-x` version.
- Do not remove `eslint-plugin-import` while any direct config, processor, rule, or shared export still refers to it.
- Do not add `@eslint/compat` or Facile's plugin normalization to the consumer. Add only the package-manager compatibility metadata documented in this matrix.
- A third-party plugin with no verified ESLint 10 support and no unambiguous flat-config representation is a blocker, not a deletion candidate.

## Framework handling

| Framework           | Required handling                                                                                                                                                                                   |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React               | Read the installed `react` major. When React rules are active, add a final matching config with `settings: { react: { version: '<major>' } }`. Do not update React.                                 |
| Next                | Verify `next` is installed and `eslint-config-facile/next` loads. Do not update Next.                                                                                                               |
| Expo / React Native | Verify the Expo preset loads with installed versions. Do not update Expo or React Native.                                                                                                           |
| Node                | Preserve module/source-type and runtime globals overrides. Change Node declarations only through the explicitly approved prerequisite flow in `SKILL.md`, never during dependency/config migration. |

## Script compatibility

Preserve the lint command's target set. Remove or replace an option only when ESLint 10 rejects it or flat config supersedes it. In particular, verify coverage before dropping `--ext`; do not simplify working scripts for style.

## Hard blockers

Stop and request a decision for:

- dirty worktree, non-Git directory, Bun, or competing package-manager evidence;
- incompatible Node when prerequisite remediation is declined, not explicitly approved, ambiguous, only partially applicable, or cannot be validated and committed cleanly;
- dynamic config whose effective behavior is not statically reconstructible;
- incompatible workspaces, frameworks, presets, parsers, processors, or plugins;
- an unverified plugin/rule mapping;
- ambiguous nested-cascade scope or TypeScript project conversion;
- source fixes that alter behavior/public APIs or a broad autofix diff;
- deletion of legacy config files before explicit confirmation.
