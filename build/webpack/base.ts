import * as webpack from 'webpack';
import * as ForkTsCheckerWebpackPlugin from 'non-bogus-fork-ts-checker-webpack-plugin';
import { BIN_DIR, NODE_MODULES_REGEX, ROOT_DIR } from '../constants';
import { configProxy } from '../util';

export default configProxy(({
    isDev,
    isProd,
    stripKeys,
    stripItems,
    options: { mode, ...rest },
}) => ({
    mode,
    devtool: 'inline-source-map',
    context: ROOT_DIR,
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
    plugins: stripItems(
        isProd(new webpack.HotModuleReplacementPlugin()),
        new ForkTsCheckerWebpackPlugin(stripKeys({
            context: ROOT_DIR,
            // tslint: true,
            checkSyntacticErrors: true,
            watch: isDev(['./src']) // optional but improves performance (fewer stat calls)
        }))
    )
}));