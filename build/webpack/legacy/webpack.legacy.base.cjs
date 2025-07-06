const path = require('path');
const { merge } = require('webpack-merge');
const { commonBaseConfig } = require('../common/webpack.common.base.cjs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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

const baseOutput = (subdir) => ({
    path: path.resolve(__dirname, `../../../dist/legacy/${subdir}`),
    publicPath: `/dist/legacy/${subdir}/`,
})

const copyWasmAssets = (subdir) => new CopyWebpackPlugin({
    patterns: [
        {
            from: path.resolve(__dirname, `../../../build/js/legacy/${subdir}/worker*.wasm`),
            to: path.resolve(__dirname, `../../../dist/legacy/${subdir}`),
            context: path.resolve(__dirname, `../../../build/js/legacy/${subdir}`),
            toType: 'dir',
        }
    ]
})

const umdConfig = merge(legacyConfig, {
    output: {
        ...baseOutput('umd'),
        filename: '[name].js',
        library: 'jassub',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    plugins: [copyWasmAssets('umd')]
});

module.exports = { umdConfig };
