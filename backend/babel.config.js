module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
    '@babel/preset-typescript',
  ],
  plugins: [
    [
      'module-resolver',
      {
        alias: {
          '@api': './src/',
          '@root': './',
        },
      },
    ],
  ],
  ignore: [/node_modules/, /dist/],
};
