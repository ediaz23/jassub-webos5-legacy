const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { merge } = require('webpack-merge');
const { esmConfig } = require('./webpack.legacy.base.cjs');
const {
    configCommonDebugProdEsm,
    configCommonMinProdEsm
} = require('../common/webpack.common.prod.cjs');

const source = path.resolve(__dirname, '../../js/legacy')
const fake_worker = path.resolve(__dirname, '../../../src/fake_worker.js')

const configLegacyDebugEsm = merge(esmConfig, configCommonDebugProdEsm, {
    resolve: { alias: { wasm: fake_worker } },
    plugins: [
        new CopyWebpackPlugin({ patterns: [{ from: `${source}/worker.debug.js` }] })
    ]
});

const configLegacyMinEsm = merge(esmConfig, configCommonMinProdEsm, {
    resolve: { alias: { wasm: fake_worker } },
    plugins: [
        new CopyWebpackPlugin({ patterns: [{ from: `${source}/worker.min.js` }] })
    ]
});

module.exports = [configLegacyDebugEsm, configLegacyMinEsm];
