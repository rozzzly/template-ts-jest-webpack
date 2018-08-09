const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');


const commonCfg = require('./webpack.shared');

module.exports = merge(commonCfg, {
    target: 'web',
    entry: [
        'webpack-hot-middleware/client',
        './src/modules/app/client'
    ],
    output: {
        publicPath: '/assets',
        filename: '[name].client.js'
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})
