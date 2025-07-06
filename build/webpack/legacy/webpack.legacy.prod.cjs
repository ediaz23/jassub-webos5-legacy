const { merge } = require('webpack-merge');
const { umdConfig } = require('./webpack.legacy.base.cjs');
const {
    configCommonDebugProdUmd,
    configCommonMinProdUmd
} = require('../common/webpack.common.prod.cjs');

function setEntry(config) {
    config.entry['jassub.worker.wams'] = `./build/js/legacy/${config.entry['jassub.worker']}.wasm.js`
    config.entry['jassub.worker'] = `./build/js/legacy/${config.entry['jassub.worker']}.js`
    return config
}

const configLegacyDebugUmd = merge(umdConfig, setEntry(configCommonDebugProdUmd));

const configLegacyMinUmd = merge(umdConfig, setEntry(configCommonMinProdUmd));

module.exports = [configLegacyDebugUmd, configLegacyMinUmd];
