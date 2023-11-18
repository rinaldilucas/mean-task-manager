var OFF = 0,
  WARN = 1,
  ERROR = 2;

module.exports = {
  root: true,
  ignorePatterns: ['dist/*', 'node_modules/*'],
  overrides: [
    {
      extends: ['airbnb-typescript/base'],
      files: ['*.ts'],
      parserOptions: {
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        createDefaultProgram: true,
        project: ['./tsconfig.json'],
      },
      rules: {
        'newline-after-var': OFF,
        '@typescript-eslint/explicit-function-return-type': ERROR,
        '@typescript-eslint/lines-between-class-members': OFF,
        '@typescript-eslint/no-explicit-any': OFF,
        '@typescript-eslint/no-this-alias': OFF,
        '@typescript-eslint/no-unused-vars': WARN,
        '@typescript-eslint/no-use-before-define': OFF,
        '@typescript-eslint/no-var-requires': OFF,
        'dot-notation': OFF,
        'import/extensions': OFF,
        'import/no-extraneous-dependencies': OFF,
        'new-cap': OFF,
        'newline-after-var': OFF,
        'no-debugger': WARN,
        'no-lonely-if': ERROR,
        'no-new': OFF,
        'no-undef': OFF,
        'no-unused-vars': WARN,
        'no-useless-constructor': OFF,
        'prefer-rest-params': OFF,
        'prefer-spread': OFF,
        semi: [ERROR, 'always'],
      },
    },
  ],
};
