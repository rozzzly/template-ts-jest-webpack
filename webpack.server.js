const nodeExternals = require('webpack-node-externals');
const merge = require('webpack-merge');
const webpack = require('webpack');
const path = require('path');


const sharedCfg = require('./webpack.shared');

module.exports = merge(sharedCfg, {
    name: 'server',
    target: 'node',
    entry: {
        entrypoint: [
            'webpack/hot/poll?1000',
            './src/modules/app/server/entrypoint'
        ]
    },
    output: {
        filename: '[name].server.js',
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
    ]
})
