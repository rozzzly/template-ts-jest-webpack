import * as nodeExternals from 'webpack-node-externals';
import * as webpack from 'webpack';
import * as mergeCfg from 'webpack-merge';
import baseCfg from './base';
import { ROOT_DIR, BIN_DIR, CACHE_GROUPS } from '../constants';
import { createCacheGroups, join } from '../util';

export default mergeCfg(baseCfg, {
    entry: {
        shared: [
            './src/modules/app/shared/App'
        ]
    },
    output: {
        filename: '[name].shared.js'
    },
    context: ROOT_DIR,
    optimization: {
        // runtimeChunk: 'single',
        splitChunks: {
            minSize: 100,
            chunks: 'all',
            cacheGroups: createCacheGroups(CACHE_GROUPS.shared)
        }
    },
    externals: [nodeExternals()],
    plugins: [
        new webpack.DllPlugin({
            context: ROOT_DIR,
            name: '[name]_[hash]',
            path: join(BIN_DIR, '[name].manifest.json')
        })
    ]
});
