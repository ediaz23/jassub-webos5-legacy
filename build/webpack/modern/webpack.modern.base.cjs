const path = require('path');
const { merge } = require('webpack-merge');
const { commonBaseConfig } = require('../common/webpack.common.base.cjs');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const modernConfig = merge(commonBaseConfig, {
    target: ['browserslist']
});

modernConfig.module.rules[0].use.push({
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
},)

const baseOutput = (subdir) => ({
    path: path.resolve(__dirname, `../../../dist/modern/${subdir}`),
    publicPath: `/dist/modern/${subdir}/`,
})

const copyWasmAssets = (subdir) => new CopyWebpackPlugin({
    patterns: [
        {
            from: path.resolve(__dirname, `../../../build/js/modern/${subdir}/worker*.wasm`),
            to: path.resolve(__dirname, `../../../dist/modern/${subdir}`),
            context: path.resolve(__dirname, `../../../build/js/modern/${subdir}`),
            toType: 'dir',
        }
    ]
})

const umdConfig = merge(modernConfig, {
    output: {
        ...baseOutput('umd'),
        filename: '[name].js',
        library: 'jassub',
        libraryTarget: 'umd',
        libraryExport: 'default'
    },
    plugins: [copyWasmAssets('umd')]
});

const esmConfig = merge(modernConfig, {
    experiments: {
        outputModule: true
    },
    output: {
        ...baseOutput('esm'),
        filename: '[name].js',
        library: {
            type: 'module',
        },
        libraryExport: 'default',
    },
    plugins: [copyWasmAssets('esm')]
});

module.exports = { umdConfig, esmConfig };
