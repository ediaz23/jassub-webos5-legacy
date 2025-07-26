const { merge } = require('webpack-merge');
const { esmConfig, getWamsFallback } = require('./webpack.modern.base.cjs');
const {
    configCommonDebugProdEsm,
    configCommonMinProdEsm,
} = require('../common/webpack.common.prod.cjs');

const configModernDebugEsm = merge(esmConfig, configCommonDebugProdEsm, getWamsFallback('modern', configCommonDebugProdEsm));

const configModernMinEsm = merge(esmConfig, configCommonMinProdEsm, getWamsFallback('modern', configCommonMinProdEsm));

module.exports = [configModernDebugEsm, configModernMinEsm];
