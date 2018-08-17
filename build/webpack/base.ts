import * as webpack from 'webpack';
import * as ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { BIN_DIR, NODE_MODULES_REGEX } from '../constants';

export default {
    mode: 'development',
    devtool: 'inline-source-map',

    resolve: {
        extensions: [
            '.ts', '.tsx', '.js', '.jsx'
        ]
    },
    output: {
        path: BIN_DIR
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: NODE_MODULES_REGEX,
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
        new webpack.HotModuleReplacementPlugin(),
        new ForkTsCheckerWebpackPlugin({
            // tslint: true,
            checkSyntacticErrors: true,
            watch: ['./src'] // optional but improves performance (fewer stat calls)
        }),
    ]
} as webpack.Configuration;