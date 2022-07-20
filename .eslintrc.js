const OFF = 0,
    ERROR = 2;

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
                indent: [ERROR, 4],
                semi: [ERROR, 'always'],
                'dot-notation': OFF
            }
        }
    ],
    ignorePatterns: ['node_modules/', 'docs/', 'dist/', '*.d.ts']
};
