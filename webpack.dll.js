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
    optimization: {
        // runtimeChunk: 'single',
        splitChunks: {
            minSize: 100,
            chunks: 'all',
            cacheGroups: {
                // default: false,
                vendor: {
                    name: 'vendor',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/
                },
                frontend: {
                    name: 'frontend',
                    chunks: 'all',
                    // priority: 100,
                    test: /[\\/]src[\\/]modules[\\/]frontend[\\/]/
                },
                app: {
                    name: 'app',
                    chunks: 'all',
                    // priority: 0,
                    test: /[\\/]src[\\/]modules[\\/]app[\\/]shared[\\/]/
                },
            }
        }
    },
    externals: [nodeExternals()],
    plugins: [
        new webpack.DllPlugin({
            // context: __dirname,
            name: "[name]_[hash]",
            path: path.join(baseCfg.output.path, '[name].manifest.json')
        })
    ]
});
