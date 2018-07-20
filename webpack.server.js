const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');


const commonCfg = require('./webpack.common');

module.exports = merge(commonCfg, {
    target: 'node',
    entry: {
        app: [
            'webpack/hot/poll?1000',
            './src/server'
        ]
    },
    output: {
        filename: '[name].server.js',
        path: path.resolve(__dirname, 'bin'),
        library: 'init',
        libraryExport: 'default',
        libraryTarget: 'commonjs2'

    },
    externals: [
        nodeExternals({
            whitelist: [
                'webpack/hot/poll?1000'
            ]
        })
    ],
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
})
