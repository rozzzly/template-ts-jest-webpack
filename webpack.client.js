const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

const baseCfg = require('./webpack.base');

module.exports = merge(baseCfg, {
    // target: 'web',
    entry: {
        clientApp: [
            // 'webpack-hot-middleware/client',
            './src/modules/app/client'
        ]
    },
    output: {
        publicPath: '/assets',
        filename: '[name].client.js'
    },
    plugins: [
        // ...(['main'].map(dllName => (
            new webpack.DllReferencePlugin({
                // context: __dirname,
                manifest: path.join(baseCfg.output.path, `shared.manifest.json`)
                // manifest: path.join(__dirname, 'bin', `${dllName}.dll-manifest.json`)
            })
        // )))
    ]
})
