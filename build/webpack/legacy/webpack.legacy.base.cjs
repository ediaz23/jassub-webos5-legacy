const path = require('path');
const { merge } = require('webpack-merge');
const { commonBaseConfig } = require('../common/webpack.common.base.cjs');

const legacyConfig = merge(commonBaseConfig, {
    target: ['web', 'es5']
});

legacyConfig.module.rules[0].use.push({
    loader: 'babel-loader',
    options: {
        sourceType: 'unambiguous',
        presets: [
            [
                '@babel/preset-env',
                {
                    useBuiltIns: 'usage',
                    targets: {
                        chrome: '38'
                    },
                    corejs: '3.39.0',
                }
            ],
        ],
        plugins: [
            '@babel/plugin-transform-runtime',
            '@babel/plugin-transform-parameters',
        ],
    },
},)

const esmConfig = merge(legacyConfig, {
    experiments: {
        outputModule: true
    },
    output: {
        path: path.resolve(__dirname, '../../../dist/legacy'),
        publicPath: '/dist/legacy/',
        library: {
            type: 'module',
        },
    },
});

module.exports = { esmConfig };
