# Migration report template

## Status

Use exactly one: **Completed**, **Blocked after changes**, **Stopped without changes**, or **Incomplete**.

## Environment and scope

- Git root:
- Package manager and version:
- Existing lockfile:
- Running Node and declared constraints before/after:
- Node prerequisite remediation: not needed / declined / completed / blocked
- Node prerequisite commit SHA: not applicable / not committed / SHA
- Workspaces analyzed:
- Configurations and inheritance found:
- Framework versions detected:

## Versions

| Dependency             | Before | After/target | Manifest(s) |
| ---------------------- | ------ | ------------ | ----------- |
| Node                   |        |              |             |
| ESLint                 |        |              |             |
| `eslint-config-facile` |        | `2.0.0-rc.0` |             |
| Prettier               |        |              |             |
| TypeScript             |        |              |             |

List relevant plugin changes separately. Confirm explicitly that React, React Native, Next, and Expo were not upgraded. If Node changed, list only the explicitly approved prerequisite files and values, whether the approved Node changes stayed uncommitted or were included in authorized commit(s)/push (with the isolated commit SHA when one exists); otherwise confirm that Node did not change.

## Baseline

- Command and exit code:
- Errors/warnings and affected paths:
- If unavailable, exact reason:

Never call an issue pre-existing unless this baseline observed it.

## Changes

- Node prerequisite files and isolated commit or uncommitted state, if approved:
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
| Node prerequisite checks, if used  |           |        |
| Effective config/preset load       |           |        |
| Direct ESLint                      |           |        |
| Canonical lint                     |           |        |
| Typecheck (if source changed)      |           |        |
| Relevant tests (if source changed) |           |        |
| `git diff --check`                 |           |        |
| Idempotence/install check          |           |        |

Distinguish failures from non-ESLint steps embedded in a lint script.

## Git and delivery

- Requested actions: none / commit / branch / push / merge request / pull request / other
- Commit SHA(s): not created or SHA(s)
- Branch and push destination: not applicable or details
- Merge/pull request URL: not requested or URL
- Delivery status: not requested / completed / failed at <step>

## Remaining findings and decisions

- Verified baseline findings not changed:
- Migration-introduced findings:
- Unverified findings when no baseline existed:
- Blockers/ambiguities and the exact user decision required:

Do not include secrets, tokens, raw environment contents, or sensitive source excerpts.
