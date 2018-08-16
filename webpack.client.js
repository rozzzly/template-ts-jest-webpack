const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');

const sharedCfg = require('./webpack.shared');

module.exports = merge(sharedCfg, {
    name: 'client',
    target: 'web',
    entry: {
        entrypoint: [
            'webpack-hot-middleware/client',
            './src/modules/app/client'
        ]
    },
    output: {
        publicPath: '/assets',
        filename: '[name].client.js'
    },
    optimization: {
        splitChunks: {
            minSize: 100,
            chunks: 'all',
            cacheGroups: {
                // default: false,
                vendor: {
                    name: 'vendor',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/
                }
            }
        }
    },
    plugins: [
        ...(['frontend', 'app'].map(dllName => (
            new webpack.DllReferencePlugin({
                manifest: path.join(sharedCfg.output.path, `${dllName}.manifest.json`)
            })
        )))
    ]
})
