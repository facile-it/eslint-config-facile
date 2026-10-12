# Migration target

This file is the single source of truth for the migration target. Do not substitute newer versions or `latest`.

```json
{
    "eslint-config-facile": "2.0.0-rc.0",
    "eslint": "^10.0.0",
    "node": "^20.19.0 || ^22.13.0 || >=24",
    "prettier": "^3.6.0",
    "typescript": "^4.0 || ^5.0 || ^6.0"
}
```

The `eslint-config-facile` value is exact. The remaining values are supported ranges.

## Public flat-config entry points

| Preset | Import                       |
| ------ | ---------------------------- |
| Base   | `eslint-config-facile`       |
| Node   | `eslint-config-facile/node`  |
| React  | `eslint-config-facile/react` |
| Next   | `eslint-config-facile/next`  |
| Expo   | `eslint-config-facile/expo`  |

All entry points export flat-config arrays. Compose them with `defineConfig` from `eslint/config`, preserving array and override order.

## Target-specific constraints

- The base preset enables `parserOptions.projectService: true`.
- `eslint-plugin-import` has been replaced by `eslint-plugin-import-x`; consumer-owned equivalent custom rules use the `import-x/` namespace only after rule compatibility is verified.
- React version auto-detection is temporarily unavailable under ESLint 10. React-based consumers must set `settings.react.version` to their installed React major when the React plugin is active.
- Next consumers must already have `next` installed because the Next config resolves its parser from that package.
- Compatibility wrappers, plugin normalization, and upstream overrides are internal to `eslint-config-facile`; consumers must not copy them.

## Release update rule

When the package is released as stable `2.0.0`, change the exact target in this file and the repository package version in the same change. The structural test must fail whenever these values diverge.
