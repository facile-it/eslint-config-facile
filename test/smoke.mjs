import { ESLint } from 'eslint'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const require = createRequire(import.meta.url)

function isPackageAvailable(name) {
    try {
        require.resolve(name)
        return true
    } catch {
        return false
    }
}

const configs = [
    { name: 'index', file: '../dist/index.mjs', target: '../test/index.mts' },
    { name: 'node', file: '../dist/node.mjs', target: '../test/index.mts' },
    { name: 'react', file: '../dist/react.mjs', target: '../test/react.tsx' },
    { name: 'next', file: '../dist/next.mjs', target: '../test/next.tsx', requires: 'next' },
    { name: 'expo', file: '../dist/expo.mjs', target: '../test/expo.tsx' },
]

for (const { name, file, target, requires } of configs) {
    if (requires && !isPackageAvailable(requires)) {
        console.log(`Smoke test skipped: ${name} (${requires} not installed)`)
        continue
    }

    const eslint = new ESLint({
        overrideConfigFile: path.resolve(__dirname, file),
        overrideConfig: {
            languageOptions: {
                parserOptions: {
                    projectService: {
                        allowDefaultProject: ['test/*.tsx'],
                    },
                },
            },
            // Silence any warning about a missing React package during smoke testing.
            settings: {
                react: {
                    version: '18.0',
                },
            },
        },
    })

    const results = await eslint.lintFiles([path.resolve(__dirname, target)])
    const errors = results.flatMap(result => result.messages.filter(message => message.severity === 2))

    if (errors.length > 0) {
        console.error(`Smoke test failed for "${name}":`, errors)
        process.exit(1)
    }

    console.log(`Smoke test passed: ${name}`)
}
