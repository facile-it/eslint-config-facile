import type { TSESLint } from '@typescript-eslint/utils'

export default {
    rules: {
        'react-hooks/refs': 'off',
        'react-hooks/set-state-in-effect': 'off',
        'react-hooks/immutability': 'off',
    } as const,
} satisfies TSESLint.FlatConfig.Config
