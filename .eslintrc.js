var OFF = 0,
    WARN = 1,
    ERROR = 2;

module.exports = {
    ignorePatterns: [],
    overrides: [
        {
            extends: [
                'plugin:@angular-eslint/recommended', //
                'plugin:@angular-eslint/template/process-inline-templates',
                'plugin:@typescript-eslint/recommended',
                'standard'
            ],
            files: ['*.ts'],
            parserOptions: {
                createDefaultProgram: true,
                project: ['tsconfig.json', 'e2e/tsconfig.json']
            },
            rules: {
                '@angular-eslint/component-selector': [
                    'error',
                    {
                        prefix: 'app',
                        style: 'kebab-case',
                        type: 'element'
                    }
                ],
                '@angular-eslint/directive-selector': [
                    'error',
                    {
                        prefix: 'app',
                        style: 'camelCase',
                        type: 'attribute'
                    }
                ],
                '@typescript-eslint/no-explicit-any': OFF,
                '@typescript-eslint/no-this-alias': OFF,
                '@typescript-eslint/no-unused-vars': WARN,
                '@typescript-eslint/no-var-requires': OFF,
                'dot-notation': OFF,
                indent: [2, 4],
                'n/handle-callback-err': OFF,
                'new-cap': OFF,
                'no-debugger': WARN,
                'no-new': OFF,
                'no-undef': OFF,
                'no-unused-vars': WARN,
                'prefer-rest-params': OFF,
                'prefer-spread': OFF,
                semi: [ERROR, 'always'],
                'no-useless-constructor': OFF
            }
        },
        {
            extends: ['plugin:@angular-eslint/template/recommended'],
            files: ['*.html']
        }
    ],
    root: true
};
