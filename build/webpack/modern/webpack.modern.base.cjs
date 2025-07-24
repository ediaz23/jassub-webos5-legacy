const path = require('path');
const { merge } = require('webpack-merge');
const { commonBaseConfig, getWamsFallback } = require('../common/webpack.common.base.cjs');

const modernConfig = merge(commonBaseConfig, {
    target: ['browserslist'],
    module: {
        rules: [{
            test: /\.(js)$/,
            exclude: [/core-js/],
            loader: 'babel-loader',
            options: {
                sourceType: 'unambiguous',
                presets: [
                    [
                        '@babel/preset-env',
                        {
                            useBuiltIns: 'usage',
                            targets: {
                                chrome: '68'
                            },
                            bugfixes: true,
                            corejs: '3.39.0',
                        }
                    ],
                ],
                plugins: [
                    '@babel/plugin-transform-runtime',
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                    '@babel/plugin-proposal-optional-chaining'
                ],
            },
        }]
    }
});

const esmConfig = merge(modernConfig, {
    experiments: {
        outputModule: true
    },
    output: {
        path: path.resolve(__dirname, '../../../dist/modern'),
        publicPath: '/dist/modern/',
        library: {
            type: 'module',
        },
    },
});

module.exports = { esmConfig, getWamsFallback };
