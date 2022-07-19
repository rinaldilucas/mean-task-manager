module.exports = {
    root: true,
    extends: ['eslint:recommended'],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module'
    },
    env: {
        es6: true,
        node: true
    },
    overrides: [
        {
            files: ['**/*.ts', '**/*.tsx'],
            plugins: ['@typescript-eslint'],
            extends: ['plugin:@typescript-eslint/recommended', 'standard'],
            globals: {
                Atomics: 'readonly',
                SharedArrayBuffer: 'readonly'
            },
            rules: {
                indent: ['error', 4],
                semi: [2, 'always'],
                'dot-notation': 0
            }
        }
    ]
};
