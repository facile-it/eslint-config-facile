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
- Do not update React, React Native, Next, Expo, or other application frameworks. Update Node declarations only through the explicitly approved prerequisite flow in Phase 1; never change them during the migration itself.
- Do not stash, reset, destructively check out paths, or silently roll back changes.
- By default, leave all verified migration changes uncommitted. Do not create or switch branches, push, or open a merge request or pull request unless the user explicitly requests those actions.
- Follow explicit Git and delivery instructions from the user's initial request or a later message. Do not ask for confirmation again when an instruction already authorizes an action. A request to open a merge request or pull request authorizes the branch creation, commit or commits, push, and request creation needed to deliver it.
- Treat standalone Git instructions narrowly: a commit request does not authorize a push, and a push request does not authorize unrelated changes. A direct commit or push to the default or protected branch is allowed only when the user explicitly requests that exact action and destination.
- Do not bypass commit hooks, amend an existing commit, force any Git operation (including force-push, even if requested), or merge a request unless explicitly requested. If a requested Git or delivery action fails, preserve the visible state and report the failure instead of weakening safeguards.
- Do not disable rules, lower severities, or add `eslint-disable`, `@ts-ignore`, or equivalent suppressions merely to obtain a passing lint.
- Do not copy `eslint-config-facile`'s internal compatibility shims or plugin normalization into the consumer. Add only the package-manager compatibility metadata documented in `references/migration-matrix.md`.
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
8. Record `node --version` and every declared Node constraint (`engines`, Volta, `.nvmrc`, tool-version files, CI, and containers). Compare both the running version and the repository's supported runtime contract with the target requirement in `references/target.md`. If either is incompatible, mark Node prerequisite remediation as required, make no changes yet, and continue the remaining read-only preflight checks.
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
13. If Node prerequisite remediation is required, handle it only after every other read-only preflight check has passed:
    - List every affected file and current value, explain why it blocks the migration, and present an exact prerequisite-only plan containing each proposed value, any package-manager-generated lockfile update, and the validation commands. Include a proposed commit message only when the user's instructions authorize a commit (an MR/PR request counts).
    - Ask whether the user explicitly approves that exact Node remediation plan. This approval governs only the Node file changes and does not authorize Git actions by itself. Do not ask again about Git actions already authorized by the user's initial request or a later instruction. If the user declines or does not choose, **STOP** without changes.
    - Do not infer a Node release line. Preserve an already established supported line when the repository makes it unambiguous; otherwise ask the user to choose among the supported lines from `references/target.md`. Do not broaden `engines.node` beyond repository policy merely to copy the complete target range.
    - After approval, update all affected Node declarations coherently and nothing else. This may include `engines`, Volta, `.nvmrc`, tool-version files, direct CI runtime declarations, and container base images only when their mapping is unambiguous. If a declaration is generated, shared externally, digest-pinned without a verified replacement, or otherwise ambiguous, **STOP** before editing and ask the user to handle the prerequisite. Never perform a partial Node upgrade.
    - Use the existing package manager only if needed to keep its lockfile consistent with an approved manifest change. Do not update ESLint or any unrelated dependency in this prerequisite step.
    - Re-read every Node declaration, run `node --version`, the package-manager version command, the repository's existing runtime/engine check when present, and `git diff --check`. Do not install or replace a system-wide Node toolchain. If the active runtime remains incompatible, ask the user to activate the approved version and **STOP** until it is verifiably active.
    - Confirm the resulting diff and that `git status --short` contains only the approved Node prerequisite files and any required generated lockfile.
    - If the user's instructions authorize a commit (an MR/PR request counts), ensure the commit lands on the user-requested destination: for an MR/PR request, create or switch to the requested branch or a dedicated conventional branch before committing when currently on the default or a protected branch. Stage only those paths and create one isolated Node prerequisite commit using the proposed message and the repository's commit convention, without asking for another confirmation. Do not amend or bypass hooks, and do not push yet unless the user explicitly requested that sequencing. If a hook changes files or the commit fails, **STOP**, preserve the visible state, and report the failure instead of retrying with bypass flags.
    - If no commit was authorized, leave the approved Node changes uncommitted and continue; this approved dirty state is expected.
    - Record the prerequisite commit SHA or `not committed`, then continue to Phase 2. After an authorized commit, `git status --short` must be empty; without one, it must contain only the approved Node prerequisite paths. All later migration changes remain uncommitted unless the user explicitly requested otherwise. Any other worktree state is a **STOP**.

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
- package-manager-specific peer handling: the pnpm allowance, the npm root overrides, or the expected Yarn warnings, including existing settings to preserve;
- baseline status;
- known blockers or decisions.

**STOP** for confirmation before any choice that can change lint behavior, including an uncertain preset mapping, plugin replacement without a verified rule mapping, ambiguous `parserOptions.project` conversion, autonomous-vs-root workspace config choice, or a broad expected source rewrite.

## Phase 4: dependencies

1. Use the exact `eslint-config-facile` target and supported ranges from `references/target.md`; never resolve `latest`.
2. Apply peer-range handling according to the detected package manager:
    - For pnpm, merge `pnpm.peerDependencyRules.allowedVersions.eslint: "10"` into the root manifest before the dependency update. Preserve all existing `pnpm` settings. This allowance is required because some upstream plugins still publish peer ranges that exclude ESLint 10 even though this package supplies compatibility shims; it accepts that peer relationship without overriding or selecting the installed ESLint version.
    - For npm, merge the four root `overrides` from `references/migration-matrix.md` before the dependency update, preserving every existing override. Use `$eslint` exactly so the affected plugins resolve against the consumer's declared ESLint version; dependency-package overrides are not inherited by the consumer.
    - For Yarn, do not add the pnpm block, `resolutions`, `packageExtensions`, or broad log filters. Yarn cannot replace these existing peer ranges through `packageExtensions`; the expected peer-range warnings alone are not blockers.
    - If the dependency update exits non-zero because an existing strict peer-dependency policy rejects an upstream range, **STOP** and report the exact error; do not use `--force`, `--legacy-peer-deps`, `--ignore-peer-dependencies`, or relax repository policy.
3. Update all manifests that directly declare ESLint or `eslint-config-facile`. Do not leave a workspace on an incompatible major.
4. Upgrade Prettier only when its resolved/declared version is below the target peer range.
5. Upgrade TypeScript only when it is outside the supported target range. Preserve a supported TypeScript version.
6. Keep third-party ESLint plugins only after verifying ESLint 10 compatibility and a flat-config path or an unambiguous conversion. Upgrade a plugin only when necessary and compatibility is verifiable.
7. If a required third-party preset/plugin is not compatible or cannot be converted unambiguously, **STOP** without removing it.
8. Do not update application frameworks to satisfy an ESLint preset. For the Next preset, verify `next` is installed in the consumer; otherwise **STOP**.
9. Execute the package-manager command from `references/migration-matrix.md`, scoped according to the repository's workspace conventions. Verify that only the existing lockfile changed and that dependency resolution succeeds.

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
6. Confirm there is still exactly one package-manager family/lockfile, that application framework declarations did not change, and that Node declarations match the approved prerequisite changes (and their isolated commit, when one was authorized) with no later migration-phase edits.
7. Check idempotence without making speculative updates: manifests already target the recorded versions, flat config has no legacy conversion left, and rerunning the package-manager install plus verification produces no tracked diff. Report any drift instead of hiding it.

## Phase 9: requested Git and delivery actions

Run this phase only after the migration itself satisfies all **Completed** verification requirements. Do not commit, push, or open a request for a blocked or incomplete migration.

1. Determine authorization from the user's initial request and later explicit instructions. Invoking this skill alone does not authorize any Git or delivery action.
2. If no Git or delivery action was requested, leave every migration change uncommitted, do not create or switch branches, do not push, and do not open a request. Record delivery as not requested and continue to the report.
3. If the user requested a merge request or pull request, perform the necessary branch creation, commits, push, and request creation without asking for confirmation again. Use a requested source/target branch, draft state, title, assignee, or other supplied detail; otherwise use the repository convention and remote default target. Do not merge unless explicitly requested.
4. For standalone commit, branch, or push instructions, perform only the requested actions and their strictly necessary prerequisites. A request to commit on the default branch authorizes that commit but not a push; pushing to the default/protected branch requires an explicit request naming that action and destination.
5. Before any authorized commit, inspect the final diff and status and stage only migration files. Use the repository's commit convention. Do not amend or bypass hooks. If hooks modify files or the commit fails, preserve the visible state and report the failure.
6. Before any authorized push or request creation, verify the destination and preserve all requested metadata. Never force-push or bypass branch protection.
7. Record actions performed, commit SHA or SHAs, branch and push destination, and merge/pull request URL when applicable. If a requested action fails, do not weaken safeguards; report **Incomplete** with the exact failed step and preserved repository state.

## Phase 10: report

Report using `references/report-template.md`. Include every command and exit code, even failures. State one of:

- **Completed**: canonical lint is green, required verification passed, and no unresolved blocker remains. Completed may legitimately leave a verified uncommitted diff when no Git or delivery action was requested;
- **Blocked after changes**: preserve the visible diff and explain the decision needed;
- **Stopped without changes**: name the preflight blocker;
- **Incomplete**: lint remains red, required verification could not run, or an explicitly requested Git/delivery action failed.

Never claim completion based only on config loading or a partial lint scope.
