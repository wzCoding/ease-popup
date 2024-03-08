const path = require('path');

module.exports = [
    {
        mode: 'production',
        entry: './src/js/index.js',
        output: {
            filename: 'EasePopup.js',
            path: path.resolve(__dirname, 'dist'),
            library: {
                name: 'EasePopup',
                type: 'var',
                export: 'default',
            },
            clean: true
        }
    }
]