const pkg = require('../../../package.json');

const commonBaseConfig = {
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.(js)$/,
                exclude: [/core-js/],
                use: [
                    {
                        loader: 'string-replace-loader',
                        options: {
                            search: '__VERSION__',
                            replace: pkg.version,
                        },
                    }
                ],
            },
        ],
    },
    resolve: {
        fallback: {
            stream: require.resolve('stream-browserify'),
        },
    },
}

const prodEntries = {
    'jassub.webos': './src/jassub.js',
}

module.exports = { commonBaseConfig, prodEntries };
