const EsLintWebpackPlugin = require('eslint-webpack-plugin');
const { prodEntries } = require('../common/webpack.common.base.cjs');

const plugins = [
    new EsLintWebpackPlugin({
        configType: 'flat',
        files: [
            'src/*.js',
        ]
    })
]

function getEntries(type) {
    const out = {...prodEntries}
    out['jassub.worker'] = `${type}/${out['jassub.worker']}`
    return out
}

const configCommonDebugProdUmd = {
    mode: 'development',
    entry: getEntries('umd'),
    output: {
        filename: '[name].debug.js'
    }
};

const configCommonMinProdUmd = {
    mode: 'production',
    entry: getEntries('umd'),
    output: {
        filename: '[name].min.js'
    },
    performance: { hints: false },
    plugins
};

const configCommonDebugProdEsm = {
    mode: 'development',
    entry: getEntries('esm'),
    output: {
        filename: '[name].debug.js'
    }
};

const configCommonMinProdEsm = {
    mode: 'production',
    entry: getEntries('esm'),
    output: {
        filename: '[name].min.js'
    },
    optimization: {
        usedExports: false,
    },
    performance: { hints: false },
    plugins
};

module.exports = { configCommonDebugProdEsm, configCommonMinProdEsm, configCommonDebugProdUmd, configCommonMinProdUmd };
