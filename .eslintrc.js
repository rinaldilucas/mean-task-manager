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
        'airbnb-typescript/base'
      ],
      files: ['*.ts'],
      parserOptions: {
        createDefaultProgram: true,
        project: ['tsconfig.json']
      },
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case'
          }
        ],
        'import/no-extraneous-dependencies': OFF,
        'import/extensions': OFF,
        '@typescript-eslint/no-use-before-define': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/explicit-function-return-type': ERROR,
        '@typescript-eslint/no-this-alias': OFF,
        '@typescript-eslint/no-unused-vars': WARN,
        '@typescript-eslint/no-var-requires': OFF,
        'newline-after-var': OFF,
        'no-lonely-if': ERROR,
        'dot-notation': OFF,
        'new-cap': OFF,
        'no-debugger': WARN,
        'no-new': OFF,
        'no-undef': OFF,
        'no-unused-vars': WARN,
        'prefer-rest-params': OFF,
        'prefer-spread': OFF,
        'no-useless-constructor': OFF,
        semi: [ERROR, 'always'],
        "newline-after-var": OFF,
        '@typescript-eslint/lines-between-class-members': OFF
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
