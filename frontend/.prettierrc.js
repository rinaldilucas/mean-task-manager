module.exports = {
  arrowParens: 'always',
  embeddedLanguageFormatting: 'auto',
  endOfLine: 'auto',
  htmlWhitespaceSensitivity: 'ignore',
  importOrder: ['^@angular/(.*)$', '^(?!(?:@angular/|(@app/.+|@root/.+|[./].*))).+$', '^(@app/.+|@root/.+|[./].*)$'],
  importOrderParserPlugins: ['typescript', 'decorators-legacy'],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [require.resolve('@trivago/prettier-plugin-sort-imports')],
  printWidth: 135,
  proseWrap: 'preserve',
  quoteProps: 'consistent',
  trailingComma: 'all',
  overrides: [
    {
      files: ['*.ts', '*.js'],
      options: {
        singleQuote: true,
      },
    },
  ],
};
