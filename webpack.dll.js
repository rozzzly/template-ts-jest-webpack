const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const mergeCfg = require('webpack-merge');
const baseCfg = require('./webpack.base');

module.exports = mergeCfg(baseCfg, {
    entry: {
        shared: [
            './src/modules/app/shared/App'
        ]
    },
    output: {
        filename: '[name].dll.js'
    },
    // externals: [nodeExternals()],
    plugins: [
        new webpack.DllPlugin({
            // context: __dirname,
            name: "[name]_[hash]",
            path: path.join(baseCfg.output.path, '[name].manifest.json')
        })
    ]
});
