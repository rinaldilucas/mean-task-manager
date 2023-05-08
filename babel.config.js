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
                    '@models': './api/models',
                    '@controllers': './api/controllers',
                    '@middlewares': './api/middlewares'
                }
            }
        ]
    ],
    ignore: ['**/*.spec.ts']
};
