var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  root: true,
  ignorePatterns: ['dist/*', 'node_modules/*', 'src/assets/*'],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  overrides: [
    {
      plugins: ['path'],
      extends: [
        'plugin:@angular-eslint/recommended',
        'plugin:@angular-eslint/template/process-inline-templates',
        'airbnb-typescript/base',
        'plugin:prettier/recommended',
      ],
      files: ['*.ts'],
      parserOptions: {
        createDefaultProgram: true,
        project: ['tsconfig.json'],
      },
      rules: {
        'path/no-relative-imports': [
          'warn',
          {
            maxDepth: 0,
            suggested: false,
          },
        ],
        'prettier/prettier': [
          'warn',
          {
            arrowParens: 'always',
            embeddedLanguageFormatting: 'auto',
            endOfLine: 'auto',
            htmlWhitespaceSensitivity: 'ignore',
            printWidth: 135,
            proseWrap: 'preserve',
            quoteProps: 'consistent',
            trailingComma: 'all',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case',
          },
        ],
        '@typescript-eslint/naming-convention': [
          ERROR,
          {
            selector: 'variable',
            format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
            leadingUnderscore: 'allow',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': ERROR,
        '@typescript-eslint/lines-between-class-members': OFF,
        '@typescript-eslint/no-unused-vars': [WARN, { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        '@typescript-eslint/no-use-before-define': OFF,
        '@typescript-eslint/no-var-requires': ERROR,
        'dot-notation': ERROR,
        'import/extensions': OFF,
        'import/no-extraneous-dependencies': OFF,
        'no-debugger': WARN,
        'no-lonely-if': ERROR,
        'no-new': ERROR,
        'no-useless-constructor': OFF,
        'prefer-rest-params': ERROR,
        'prefer-spread': ERROR,
        'semi': [ERROR, 'always'],
      },
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
        '@angular-eslint/template/button-has-type': WARN,
      },
    },
    {
      files: ['*.html'],
      excludedFiles: ['*inline-template-*.component.html'],
      extends: ['plugin:prettier/recommended'],
      rules: {
        'prettier/prettier': [
          'warn',
          {
            arrowParens: 'always',
            embeddedLanguageFormatting: 'auto',
            endOfLine: 'auto',
            htmlWhitespaceSensitivity: 'ignore',
            parser: 'angular',
            printWidth: 135,
            proseWrap: 'preserve',
            quoteProps: 'consistent',
            trailingComma: 'all',
          },
        ],
      },
    },
  ],
};
