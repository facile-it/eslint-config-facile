import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const skillRoot = path.join(root, '.agents/skills/eslint-10-migration')
const load = file => readFile(path.join(root, file), 'utf8')

const [packageSource, readme, skill, target, matrix, report, fixtureSource] = await Promise.all([
    load('package.json'),
    load('README.md'),
    load('.agents/skills/eslint-10-migration/SKILL.md'),
    load('.agents/skills/eslint-10-migration/references/target.md'),
    load('.agents/skills/eslint-10-migration/references/migration-matrix.md'),
    load('.agents/skills/eslint-10-migration/references/report-template.md'),
    load('test/fixtures/eslint-10-migration/scenarios.json'),
])

const packageJson = JSON.parse(packageSource)
const fixtures = JSON.parse(fixtureSource)
const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/)
assert(frontmatter, 'SKILL.md must start with YAML frontmatter')

const fields = Object.fromEntries(
    frontmatter[1]
        .split('\n')
        .filter(Boolean)
        .map(line => {
            const separator = line.indexOf(':')
            assert.notEqual(separator, -1, `invalid frontmatter line: ${line}`)
            return [line.slice(0, separator), line.slice(separator + 1).trim()]
        })
)
assert.deepEqual(Object.keys(fields).sort(), ['description', 'name'])
assert.equal(fields.name, 'eslint-10-migration')
assert(fields.description.length > 0)

const references = [...new Set([...skill.matchAll(/\]\((references\/[^)]+)\)/g)].map(match => match[1]))]
const requiredReferences = ['references/migration-matrix.md', 'references/report-template.md', 'references/target.md']
for (const reference of requiredReferences) {
    assert(references.includes(reference), `missing required reference: ${reference}`)
}
await Promise.all(references.map(reference => access(path.join(skillRoot, reference))))

const targetDataSource = target.match(/```json\n([\s\S]*?)\n```/)?.[1]
assert(targetDataSource, 'target.md must contain a JSON target block')
const targetData = JSON.parse(targetDataSource)
const targetVersion = targetData['eslint-config-facile']
assert.deepEqual(Object.keys(targetData).sort(), ['eslint', 'eslint-config-facile', 'node', 'prettier', 'typescript'])
assert.equal(targetVersion, packageJson.version)
assert.equal(targetData.eslint, '^10.0.0')
assert.equal(targetData.node, packageJson.engines.node)
assert.equal(targetData.prettier, packageJson.peerDependencies.prettier)
assert.equal(targetData.typescript, packageJson.peerDependencies.typescript)
assert(packageJson.peerDependencies.eslint.includes(targetData.eslint))

for (const entry of ['', 'node', 'react', 'next', 'expo']) {
    const importPath = entry ? `eslint-config-facile/${entry}` : 'eslint-config-facile'
    assert(target.includes(`\`${importPath}\``), `missing target entry point ${importPath}`)
    if (entry) await access(path.join(root, `${entry}.mts`))
}

for (const requiredText of [
    'git status --short',
    'worktree is clean',
    'Bun',
    'competing package-manager evidence',
    'parserOptions.projectService',
    'import-x/',
    'explicit confirmation before deleting',
    'canonical lint command',
    'typecheck and tests',
    'idempotence',
    'pnpm.peerDependencyRules.allowedVersions.eslint',
    'explicitly approves that exact Node remediation plan',
    'one isolated Node prerequisite commit',
    'Do not bypass commit hooks',
    'By default, leave all verified migration changes uncommitted',
    'Do not ask for confirmation again when an instruction already authorizes an action',
    'A request to open a merge request or pull request authorizes',
    'A direct commit or push to the default or protected branch is allowed only when the user explicitly requests that exact action and destination',
    'Invoking this skill alone does not authorize any Git or delivery action',
    'Phase 9: requested Git and delivery actions',
    'Never force-push',
    "import * as React from 'react'",
]) {
    assert(skill.includes(requiredText), `SKILL.md is missing guardrail: ${requiredText}`)
}

for (const manager of ['npm', 'pnpm', 'Yarn']) {
    assert(new RegExp(`\\|\\s*${manager}\\s*\\|`).test(matrix), `missing ${manager} migration command`)
}
const commandTargets = [...matrix.matchAll(/eslint-config-facile@([^\s`]+)/g)].map(match => match[1])
assert.deepEqual(commandTargets, [targetVersion, targetVersion, targetVersion])
assert(readme.includes(`eslint-config-facile@${targetVersion}`), 'README target must match the migration target')
for (const requiredText of [
    '### Install the skill',
    '### Use the skill',
    '--global --agent devin',
    '/eslint-10-migration',
]) {
    assert(readme.includes(requiredText), `README is missing installation or usage guidance: ${requiredText}`)
}
const npmOverridePlugins = Object.entries(packageJson.overrides ?? {})
    .filter(([, override]) => override?.eslint === '$eslint')
    .map(([plugin]) => plugin)
for (const [label, source] of [
    ['README', readme],
    ['migration matrix', matrix],
]) {
    for (const requiredText of ['"peerDependencyRules"', '"allowedVersions"', '"eslint": "10"']) {
        assert(source.includes(requiredText), `${label} is missing pnpm allowance JSON: ${requiredText}`)
    }
    assert(
        source.includes('does not override or select the installed ESLint version'),
        `${label} is missing the pnpm allowance explanation`
    )
    for (const plugin of npmOverridePlugins) {
        assert(source.includes(`"${plugin}"`), `${label} is missing npm override for ${plugin}`)
    }
    assert(source.includes('"eslint": "$eslint"'), `${label} is missing the npm $eslint override`)
    assert(source.includes('Yarn has no direct equivalent'), `${label} is missing the Yarn guidance`)
}
for (const requiredText of [
    'the npm root overrides',
    'For npm, merge the four root `overrides`',
    'For Yarn, do not add the pnpm block',
    'expected peer-range warnings alone are not blockers',
]) {
    assert(skill.includes(requiredText), `SKILL.md is missing package-manager peer handling: ${requiredText}`)
}
for (const [label, source] of [
    ['target', target],
    ['migration matrix', matrix],
]) {
    assert(
        source.includes('package-manager compatibility metadata'),
        `${label} is missing the documented package-manager metadata exception`
    )
}
const reportTargetRow = report.split('\n').find(line => line.includes('`eslint-config-facile`'))
assert(reportTargetRow?.includes(`\`${targetVersion}\``), 'report target must match the migration target')
for (const preset of ['facile', 'facile/node', 'facile/react', 'facile/next', 'facile/expo']) {
    assert(matrix.includes(`\`${preset}\``), `missing legacy mapping ${preset}`)
}
for (const field of [
    'Package manager and version',
    'Workspaces analyzed',
    'Configurations and inheritance found',
    'Node prerequisite commit SHA',
    'Requested actions',
    'Commit SHA(s)',
    'Branch and push destination',
    'Merge/pull request URL',
    'Delivery status',
    'Node prerequisite checks',
    'Baseline',
    'Files modified',
    'Files removed after confirmation',
    'Canonical lint',
    'Idempotence/install check',
    'Remaining findings and decisions',
]) {
    assert(report.includes(field), `report template is missing ${field}`)
}

const requiredScenarios = [
    'npm-eslint8-legacy',
    'yarn-eslint9-flat',
    'pnpm-nested-monorepo',
    'react-preset',
    'next-preset',
    'expo-preset',
    'baseline-errors',
    'incompatible-node',
    'dynamic-config',
    'bun-unsupported',
    'already-migrated',
]
const fixtureIds = fixtures.map(fixture => fixture.id)
assert.equal(new Set(fixtureIds).size, fixtureIds.length, 'fixture IDs must be unique')
for (const id of requiredScenarios) {
    assert(fixtureIds.includes(id), `missing required scenario: ${id}`)
}

const lockfiles = {
    npm: 'package-lock.json',
    pnpm: 'pnpm-lock.yaml',
    yarn: 'yarn.lock',
    bun: 'bun.lock',
}
for (const fixture of fixtures) {
    assert(fixture.files['package.json'], `${fixture.id} has no package.json`)
    assert.doesNotThrow(() => JSON.parse(fixture.files['package.json']), `${fixture.id} has invalid package.json`)
    assert.equal(fixture.expect.lockfile, lockfiles[fixture.manager], `${fixture.id} has the wrong expected lockfile`)
    assert(Object.hasOwn(fixture.files, fixture.expect.lockfile), `${fixture.id} does not contain its lockfile`)
    assert(fixture.expect.status, `${fixture.id} has no expected status`)
    assert(fixture.expect.preserve.length > 0, `${fixture.id} has no preservation invariant`)
}

const pnpmFixture = fixtures.find(fixture => fixture.id === 'pnpm-nested-monorepo')
assert(Object.keys(pnpmFixture.files).filter(file => file.endsWith('.eslintrc.json')).length > 1)
const yarnFixture = fixtures.find(fixture => fixture.id === 'yarn-eslint9-flat')
assert(yarnFixture.files['eslint.shared.mjs'])
const incompatibleNode = fixtures.find(fixture => fixture.id === 'incompatible-node')
assert.equal(incompatibleNode.expect.status, 'node-remediation-decision-required')
for (const invariant of [
    'no Node changes before explicit approval',
    'isolated Node prerequisite commit only when authorized',
    'no push unless explicitly requested after successful migration verification',
]) {
    assert(incompatibleNode.expect.preserve.includes(invariant), `incompatible-node is missing invariant: ${invariant}`)
}
const alreadyMigrated = fixtures.find(fixture => fixture.id === 'already-migrated')
const alreadyMigratedPackage = JSON.parse(alreadyMigrated.files['package.json'])
assert.equal(alreadyMigratedPackage.devDependencies['eslint-config-facile'], packageJson.version)

console.log(`Skill validation passed: ${fixtures.length} migration scenarios`)
