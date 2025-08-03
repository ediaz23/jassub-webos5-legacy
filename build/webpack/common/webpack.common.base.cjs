const pkg = require('../../../package.json');

const commonBaseConfig = {
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.(js|mjs)$/,
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

const prodEntries = {
    'jassub': './src/jassub.js',
    'jassub.worker': './src/worker.js',
}

module.exports = { commonBaseConfig, prodEntries };
