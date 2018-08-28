import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';

import baseCfg from './base';
import { ROOT_DIR, BIN_DIR, CACHE_GROUPS } from '../constants';
import { createCacheGroups, join, configProxy } from '../util';


export default configProxy(({
    merge,
    isDev
}) => merge(baseCfg, {
    entry: {
        shared: [
            './src/modules/app/shared/App'
        ]
    },
    output: {
        filename: isDev('[name].shared.js', '[name]_[hash:6].shared.js')
    },
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
            name: '[name]_[hash:6]',
            path: join(BIN_DIR, '[name].manifest.json')
        })
    ]
}));
