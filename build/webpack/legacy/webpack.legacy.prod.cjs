const { merge } = require('webpack-merge');
const { esmConfig } = require('./webpack.legacy.base.cjs');
const {
    configCommonDebugProdEsm,
    configCommonMinProdEsm
} = require('../common/webpack.common.prod.cjs');

const configLegacyDebugEsm = merge(esmConfig, configCommonDebugProdEsm);

const configLegacyMinEsm = merge(esmConfig, configCommonMinProdEsm);

module.exports = [configLegacyDebugEsm, configLegacyMinEsm];
