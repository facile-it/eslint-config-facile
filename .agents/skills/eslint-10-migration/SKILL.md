---
name: eslint-10-migration
description: Migrate every workspace using eslint-config-facile to ESLint 10 safely and verify the result
---

# Migrate eslint-config-facile to ESLint 10

Migrate the current Git repository and all of its workspaces to the version recorded in [references/target.md](references/target.md). Follow [references/migration-matrix.md](references/migration-matrix.md) for package-manager commands, config mappings, preservation rules, and blockers. Use [references/report-template.md](references/report-template.md) for the final report. Resolve all reference paths relative to this `SKILL.md`.

Complete the phases in order. A **STOP** means: make no further changes, explain the blocker with affected files and evidence, and ask the user for the smallest decision needed. Never guess through a STOP condition.

## Non-negotiable rules

- Cover the repository root and every workspace in one migration.
- Preserve the existing package manager and lockfile format. Never create a second lockfile.
- Use the package manager to change dependencies and update its lockfile; do not hand-edit a lockfile.
- Do not update Node, CI images, Docker images, Volta, `.nvmrc`, React, React Native, Next, Expo, or other application frameworks.
- Do not stash, reset, checkout, commit, push, or silently roll back changes.
- Do not disable rules, lower severities, or add `eslint-disable`, `@ts-ignore`, or equivalent suppressions merely to obtain a passing lint.
- Do not copy `eslint-config-facile`'s internal compatibility shims, plugin normalization, or package overrides into the consumer.
- Do not perform unrelated refactors or cosmetic modernization.
- Do not expose secrets, tokens, environment contents, or sensitive source in the report.

## Phase 1: preflight

Perform every check before modifying any file.

1. Find the Git root and confirm the current directory belongs to it.
2. Run `git status --short`. If any tracked or untracked changes exist, **STOP** and list only the changed paths. The migration requires that the worktree is clean.
3. Read all applicable repository instructions, including `AGENTS.md` files from the root down to each affected file.
4. Discover the root manifest, workspace declarations, and every workspace manifest. Account for npm, pnpm, and Yarn workspace syntax.
5. Detect the package manager from `packageManager`, lockfiles, and repository instructions:
    - npm: `package-lock.json`
    - pnpm: `pnpm-lock.yaml`
    - Yarn: `yarn.lock`
    - Bun: `bun.lock` or `bun.lockb`
6. If Bun is in use, or competing package-manager evidence indicates multiple active package managers, **STOP** without changes. Do not infer a winner from modification times.
7. Record the package-manager version declared by `packageManager`; use the repository's established Corepack or package-manager invocation.
8. Record `node --version` and every declared Node constraint (`engines`, Volta, `.nvmrc`, tool-version files, CI, and containers). Compare both the running version and the repository's supported runtime contract with the target requirement in `references/target.md`. If the current runtime is incompatible, or the declared contract still requires runtimes excluded by the target, **STOP** without changing any runtime declaration.
9. Find every ESLint configuration and ignore source, including:
    - `.eslintrc`, `.eslintrc.json`, `.eslintrc.yml`, `.eslintrc.yaml`, `.eslintrc.js`, and `.eslintrc.cjs`;
    - `eslintConfig` in every `package.json`;
    - `.eslintignore` files;
    - `eslint.config.js`, `.mjs`, `.cjs`, `.ts`, `.mts`, and `.cts`;
    - shared config modules imported or extended by those files.
10. Build an inventory for root and workspaces containing:
    - installed and declared versions of ESLint, `eslint-config-facile`, Prettier, TypeScript, ESLint plugins, parsers, React, React Native, Next, and Expo;
    - config inheritance/cascade order and the file scope of each nested config;
    - presets, plugins, processors, parsers, environments, globals, settings, parser options, ignores, overrides, custom rules, and shared exports;
    - every lint script and its effective target paths/options;
    - lockfiles and package-manager evidence.
11. If a JavaScript config is dynamic and its effective branches cannot be reconstructed statically for the current repository, **STOP** and identify the dynamic expressions.
12. Compare all workspaces. If they cannot move together without incompatible ESLint or `eslint-config-facile` combinations, **STOP**.

## Phase 2: baseline

1. If dependencies are already usable, run the repository's canonical lint command before migration. Prefer the root command that covers all workspaces; otherwise run and record each workspace command.
2. Capture command, exit code, error count, warning count, and affected paths. Keep enough structured output to compare findings, but do not add generated logs to the repository.
3. If the current environment can be installed with the detected package manager and existing lockfile without changing dependency intent, install it and run the baseline.
4. If the baseline cannot run, record the exact reason. Continue only when migration itself is still unambiguous, and never label a later finding “pre-existing” without baseline evidence.
5. Treat baseline findings as out of scope until Phase 7. Do not fix them silently.

## Phase 3: migration plan and decision gates

Before editing, present a concise plan containing:

- package manager and manifests to change;
- current and target versions;
- all config files and their conversion strategy;
- workspace/file scopes that replace legacy cascading;
- expected dependency removals/additions;
- baseline status;
- known blockers or decisions.

**STOP** for confirmation before any choice that can change lint behavior, including an uncertain preset mapping, plugin replacement without a verified rule mapping, ambiguous `parserOptions.project` conversion, autonomous-vs-root workspace config choice, or a broad expected source rewrite.

## Phase 4: dependencies

1. Use the exact `eslint-config-facile` target and supported ranges from `references/target.md`; never resolve `latest`.
2. Update all manifests that directly declare ESLint or `eslint-config-facile`. Do not leave a workspace on an incompatible major.
3. Upgrade Prettier only when its resolved/declared version is below the target peer range.
4. Upgrade TypeScript only when it is outside the supported target range. Preserve a supported TypeScript version.
5. Keep third-party ESLint plugins only after verifying ESLint 10 compatibility and a flat-config path or an unambiguous conversion. Upgrade a plugin only when necessary and compatibility is verifiable.
6. If a required third-party preset/plugin is not compatible or cannot be converted unambiguously, **STOP** without removing it.
7. Do not update application frameworks to satisfy an ESLint preset. For the Next preset, verify `next` is installed in the consumer; otherwise **STOP**.
8. Execute the package-manager command from `references/migration-matrix.md`, scoped according to the repository's workspace conventions. Verify that only the existing lockfile changed and that dependency resolution succeeds.

## Phase 5: convert configuration

Create valid flat configuration using only public `eslint-config-facile` entry points. Preserve order: later flat-config objects override earlier matching objects.

1. Select the Facile entry point for each existing preset using the migration matrix.
2. Convert root legacy configuration first, then translate nested legacy cascade layers into ordered `files` blocks rooted at the new config location. Use independent workspace configs only when the workspace is already autonomous and its lint command/config lookup proves that boundary.
3. Preserve all behavior that can be represented unambiguously:
    - global and local ignores;
    - override order and file/excluded-file scopes;
    - custom rules and options;
    - compatible custom plugins, processors, settings, parsers, environments, and globals;
    - required parser options and `tsconfigRootDir`;
    - shared exports consumed by other config modules.
4. Translate `.eslintignore` patterns before considering removal. Account for flat-config differences such as basename patterns requiring `**/` and dotfiles not being ignored implicitly. Preserve negation and ordering.
5. Translate `eslintConfig` from `package.json`, then remove that field only after the flat config loads successfully.
6. Update lint scripts only when an option is incompatible with ESLint 10/flat config. Preserve target paths and unrelated command steps. Remove legacy-only flags such as `--ext` only when the replacement config covers the same files.
7. The target enables `parserOptions.projectService`. Do not mechanically combine it with legacy `parserOptions.project`:
    - preserve `tsconfigRootDir`;
    - remove `project` only when project-service discovery is equivalent and verified by lint;
    - preserve an intentional special case only with an ESLint-supported project-service configuration;
    - for multiple tsconfigs, complex globs, or out-of-project files, **STOP** unless correctness is demonstrated by the relevant lint scope.
8. Rename `import/*` custom rules to `import-x/*` only for rule names/options verified to be equivalent. Remove `eslint-plugin-import` only if no direct config, rule, or other consumer remains.
9. For React, Next, or Expo configurations that use the React plugin, read the installed React major and add a final consumer setting with that explicit major when required by the target workaround. Do not use auto-detection on ESLint 10 while the target says it is unsupported.
10. Do not reproduce internal `@eslint/compat` wrappers or plugin-deduplication logic from this package.

## Phase 6: load and fix

1. Load/print the effective config for one representative file per distinct config scope and every Facile preset in use. If a preset cannot load with the installed framework/plugin versions, **STOP** and report the incompatibility.
2. Run ESLint with `--fix` over exactly the canonical lint scope. Prefer ESLint's integrated Prettier fixes; do not run repository-wide `prettier --write`.
3. Inspect the diff immediately. If the rewrite is broad relative to the repository or extends beyond the lint scope, show the number of files and changed lines and **STOP** for confirmation before further source edits.
4. Run lint again.
5. Fix remaining migration-introduced findings only when the source change is clearly behavior-preserving. **STOP** for semantic choices or public API/behavior changes.
6. When `import-x/default` or an equivalent rule newly rejects a React or ReactDOM default import, first preserve the existing local binding and every usage by replacing only the import with the analogous namespace import (for example, `import * as React from 'react'` or `import * as ReactDOM from 'react-dom/client'`). Run lint and typecheck. Only if the namespace import is rejected, use named imports for the methods or types actually referenced and update those usages; do not rewrite usages preemptively.

## Phase 7: baseline comparison

- Match post-migration findings against the captured baseline by rule, path, and location where possible.
- Correct migration-introduced or newly exposed findings when unambiguous.
- Report verified baseline findings separately and ask before expanding the task to fix them.
- If no baseline ran, classify unresolved findings as unverified, not pre-existing.
- Never declare success while the canonical lint command has a non-zero exit code.

## Phase 8: verification and legacy cleanup

1. Run the relevant direct ESLint command and the canonical root lint command, including all workspaces. Record every command and exit code. Distinguish non-ESLint failures embedded in `lint` scripts.
2. If source files changed, run the repository's relevant typecheck and tests.
3. Once the flat config loads and the full lint passes, list obsolete `.eslintrc*` and `.eslintignore` files and ask for explicit confirmation before deleting them. Do not delete them beforehand.
4. If confirmed, remove only the listed obsolete files and rerun the complete lint command. If not confirmed, leave them and report them as remaining cleanup.
5. Run `git diff --check` and inspect `git status --short` and the final diff.
6. Confirm there is still exactly one package-manager family/lockfile and that Node/framework declarations did not change.
7. Check idempotence without making speculative updates: manifests already target the recorded versions, flat config has no legacy conversion left, and rerunning the package-manager install plus verification produces no tracked diff. Report any drift instead of hiding it.

## Phase 9: report

Report using `references/report-template.md`. Include every command and exit code, even failures. State one of:

- **Completed**: canonical lint is green, required verification passed, and no unresolved blocker remains;
- **Blocked after changes**: preserve the visible diff and explain the decision needed;
- **Stopped without changes**: name the preflight blocker;
- **Incomplete**: lint remains red or required verification could not run.

Never claim completion based only on config loading or a partial lint scope.
