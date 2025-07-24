const pkg = require('../../../package.json');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonBaseConfig = {
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: [/core-js/],
            use: [{
                loader: 'string-replace-loader',
                options: {
                    search: '__VERSION__',
                    replace: pkg.version,
                },
            }],
        }],
    },
    resolve: {
        fallback: {
            stream: require.resolve('stream-browserify'),
        },
    },
}

const getWamsFallback = (versionCode) => {
    const source = path.resolve(__dirname, `../../js/${versionCode}/[name]`)
    return {
        resolve: {
            fallback: {
                wasm: source.replace('[name]', 'worker.debug.js')
            }
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: source.replace('[name]', 'worker.min.wasm') },
                    { from: source.replace('[name]', 'worker.debug.wasm') },
                ]
            })
        ]
    }
}

const prodEntries = {
    'jassub': './src/jassub.js',
    'jassub.worker': './src/worker.js',
}

module.exports = { commonBaseConfig, prodEntries, getWamsFallback };
