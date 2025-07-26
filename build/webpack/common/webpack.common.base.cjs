const pkg = require('../../../package.json');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const commonBaseConfig = {
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: [/core-js/, /worker\.(debug|min)\.js$/],
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

const getWamsFallback = (versionCode, config) => {
    const source = path.resolve(__dirname, `../../js/${versionCode}/[name]`)
    const target = config.mode === 'development' ? 'debug' : 'min'
    const name = 'worker.[target]'.replace('[target]', target)
    return {
        resolve: {
            alias: {
                wasm: source.replace('[name]', `${name}.js`)
            }
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    { from: source.replace('[name]', `${name}.wasm`) },
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
