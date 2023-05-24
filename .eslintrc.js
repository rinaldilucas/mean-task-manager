var OFF = 0,
    WARN = 1,
    ERROR = 2;

module.exports = {
    root: true,
    ignorePatterns: ['api-dist/*', 'app-dist/*', 'node_modules/*'],
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
                '@typescript-eslint/explicit-function-return-type': ERROR,
                '@typescript-eslint/no-this-alias': OFF,
                '@typescript-eslint/no-unused-vars': WARN,
                '@typescript-eslint/no-var-requires': OFF,
                'no-lonely-if': ERROR,
                'dot-notation': OFF,
                indent: [2, 4],
                'n/handle-callback-err': WARN,
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
            files: ['*.html'],
            rules: {
                '@angular-eslint/template/no-autofocus': WARN,
                '@angular-eslint/template/mouse-events-have-key-events': WARN,
                '@angular-eslint/template/click-events-have-key-events': WARN,
                '@angular-eslint/template/accessibility-interactive-supports-focus': OFF,
                '@angular-eslint/template/accessibility-valid-aria': WARN,
                '@angular-eslint/template/accessibility-role-has-required-aria': WARN,
                '@angular-eslint/template/button-has-type': WARN,
                '@angular-eslint/template/accessibility-elements-content': WARN,
                '@angular-eslint/template/accessibility-label-has-associated-control': WARN,
                '@angular-eslint/template/accessibility-table-scope': WARN,
                '@angular-eslint/template/no-distracting-elements': WARN,
                '@angular-eslint/template/button-has-type': WARN
            }
        }
    ]
};
