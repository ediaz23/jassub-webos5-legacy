const { merge } = require('webpack-merge');
const { umdConfig, esmConfig } = require('./webpack.modern.base.cjs');
const {
    configCommonDebugProdEsm,
    configCommonMinProdEsm,
    configCommonDebugProdUmd,
    configCommonMinProdUmd
} = require('../common/webpack.common.prod.cjs');

function setEntry(config) {
    config.entry['jassub.worker'] = `./build/js/modern/${config.entry['jassub.worker']}.js`
    return config
}

const configLegacyDebugUmd = merge(umdConfig, setEntry(configCommonDebugProdUmd));

const configLegacyMinUmd = merge(umdConfig, setEntry(configCommonMinProdUmd));

const configLegacyDebugEsm = merge(esmConfig, setEntry(configCommonDebugProdEsm));

const configLegacyMinEsm = merge(esmConfig, setEntry(configCommonMinProdEsm));

module.exports = [configLegacyDebugUmd, configLegacyMinUmd, configLegacyDebugEsm, configLegacyMinEsm];
