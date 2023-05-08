module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current'
                }
            }
        ],
        '@babel/preset-typescript'
    ],
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '@api': './api',
                    '@models': './api/models',
                    '@controllers': './api/controllers',
                    '@middlewares': './api/middlewares',
                    '@routes': './api/routes'
                }
            }
        ]
    ],
    ignore: ['**/*.spec.ts']
};
