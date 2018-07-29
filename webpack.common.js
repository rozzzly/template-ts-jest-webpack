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