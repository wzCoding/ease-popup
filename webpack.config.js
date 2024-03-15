const path = require('path')
const webpackConfigs = [
    {
        filename: 'EasePopup.js',
        libType: 'umd',
        externals:['@floating-ui/dom'],
        clean:true
    },
    {
        filename: 'EasePopup.min.js',
        libType: 'var',
        externals:[],
        clean:false
    }
]

module.exports = webpackConfigs.map(config => {
    return {
        mode: 'production',
        entry: './src/popup.js',
        output: {
            filename: config.filename,
            path: path.resolve(__dirname, 'dist'),
            library: {
                name: 'EasePopup',
                type: config.libType,
                export: 'default',
            },
            globalObject: 'this',
            clean: config.clean
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                ['@babel/preset-env', {
                                    useBuiltIns: 'entry',
                                    targets: '> 0.25%, not dead',
                                    corejs: 3
                                }]
                            ],
                            plugins: ['@babel/plugin-transform-runtime'],
                        },
                    },
                },
            ]
        },
        externals:config.externals,
    }
})