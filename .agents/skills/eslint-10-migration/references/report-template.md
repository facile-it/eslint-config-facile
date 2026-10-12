# Migration report template

## Status

Use exactly one: **Completed**, **Blocked after changes**, **Stopped without changes**, or **Incomplete**.

## Environment and scope

- Git root:
- Package manager and version:
- Existing lockfile:
- Running Node and declared constraints:
- Workspaces analyzed:
- Configurations and inheritance found:
- Framework versions detected:

## Versions

| Dependency             | Before | After/target | Manifest(s) |
| ---------------------- | ------ | ------------ | ----------- |
| ESLint                 |        |              |             |
| `eslint-config-facile` |        | `2.0.0-rc.0` |             |
| Prettier               |        |              |             |
| TypeScript             |        |              |             |

List relevant plugin changes separately. Confirm explicitly that Node, React, React Native, Next, and Expo were not upgraded.

## Baseline

- Command and exit code:
- Errors/warnings and affected paths:
- If unavailable, exact reason:

Never call an issue pre-existing unless this baseline observed it.

## Changes

- Config conversion strategy and preserved scopes:
- Files modified:
- Files removed after confirmation:
- Dependency and lockfile changes:
- ESLint autofixes:
- Manual behavior-preserving fixes:
- Legacy files retained:

## Verification

| Command                            | Exit code | Result |
| ---------------------------------- | --------: | ------ |
| Effective config/preset load       |           |        |
| Direct ESLint                      |           |        |
| Canonical lint                     |           |        |
| Typecheck (if source changed)      |           |        |
| Relevant tests (if source changed) |           |        |
| `git diff --check`                 |           |        |
| Idempotence/install check          |           |        |

Distinguish failures from non-ESLint steps embedded in a lint script.

## Remaining findings and decisions

- Verified baseline findings not changed:
- Migration-introduced findings:
- Unverified findings when no baseline existed:
- Blockers/ambiguities and the exact user decision required:

Do not include secrets, tokens, raw environment contents, or sensitive source excerpts.
