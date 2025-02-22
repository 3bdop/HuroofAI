module.exports = {
    presets: ['babel-preset-expo'],
    plugins: [
        [
            'module-resolver',
            {
                alias: {
                    '@components': './src/components',
                    '@screens': './src/screens',
                    '@hooks': './src/hooks',
                    '@services': './src/services',
                    '@config': './src/config',
                    '@utils': './src/utils',
                    '@assets': './assets'
                }
            }
        ]
    ]
};