const { merge } = require('webpack-merge');
const { esmConfig, getWamsFallback } = require('./webpack.legacy.base.cjs');
const {
    configCommonDebugProdEsm,
    configCommonMinProdEsm
} = require('../common/webpack.common.prod.cjs');

const configLegacyDebugEsm = merge(esmConfig, configCommonDebugProdEsm, getWamsFallback('legacy'));

const configLegacyMinEsm = merge(esmConfig, configCommonMinProdEsm, getWamsFallback('legacy'));

module.exports = [configLegacyDebugEsm, configLegacyMinEsm];
