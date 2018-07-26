const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

/** @type {import('webpack').Configuration} */
const cfg = {
    mode: 'development',
    devtool: 'inline-source-map',

    resolve: {
        extensions: [
            '.ts', '.tsx', '.js', '.jsx'
        ]
    },
    output: {
        path: path.resolve(__dirname, 'bin')
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                runtimeChunk: 'single',
                vendor: { // NOT USED ON SERVER
                    name: 'vendor',
                    chunks: 'all',
                    priority: 1,
                    test: /node_modules/
                },
                frontend: {
                    name: 'frontend',
                    chunks: 'all',
                    priority: 100,
                    test: /frontend/
                }
            }
        },
        
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
    plugins: [
        new ForkTsCheckerWebpackPlugin({
            tslint: true,
            checkSyntacticErrors: true,
            watch: ['./src'] // optional but improves performance (fewer stat calls)
        })
    ]
};

module.exports = cfg;