const { merge } = require('webpack-merge');
const { esmConfig, getWamsFallback } = require('./webpack.modern.base.cjs');
const {
    configCommonDebugProdEsm,
    configCommonMinProdEsm,
} = require('../common/webpack.common.prod.cjs');

const configModernDebugEsm = merge(esmConfig, configCommonDebugProdEsm, getWamsFallback('modern'));

const configModernMinEsm = merge(esmConfig, configCommonMinProdEsm, getWamsFallback('modern'));

module.exports = [configModernDebugEsm, configModernMinEsm];
