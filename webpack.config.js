const path = require('path');

module.exports = {
    mode: 'development',
    entry: './src/js/popup.js',
    output: {
        filename: 'popup.js',
        path: path.resolve(__dirname, 'dist')
    }
}