const path = require('path');
const webpack = require('webpack');
const mergeCfg = require('webpack-merge');
const baseCfg = require('./webpack.base');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = mergeCfg(baseCfg, {
    entry: [
        './src/modules/app/shared/App'
    ],
    output: {
        filename: '[name].dll.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        onlyCompileBundledFiles: true,
                        transpileOnly: true,
                        // experimentalWatchApi: true
                    }
                }]
            }
        ]
    },
    optimization: {
        runtimeChunk: 'single',
        splitChunks: {
            minSize: 100,
            chunks: 'all',
            cacheGroups: {
                vendor: { // NOT USED ON SERVER
                    name: 'vendor',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]/
                },
                shared: {
                    name: 'shared',
                    chunks: 'all',
                    test: /[\\/]src[\\/]modules[\\/].+[\\/]shared[\\/]/
                },
                frontend: {
                    name: 'frontend',
                    chunks: 'all',
                    test: /[\\/]src[\\/]modules[\\/]frontend[\\/]/
                }
            }
        },
        
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.join(__dirname, 'bin', '[name].manifest.json')
        })
    ]
});
