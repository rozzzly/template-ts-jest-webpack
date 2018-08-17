import * as merge from 'webpack-merge';
import * as webpack from 'webpack';

import baseCfg from './base';
import { createCacheGroups, join } from '../util';
import { CACHE_GROUPS, BIN_DIR, ROOT_DIR } from '../constants';

export default merge(baseCfg, {
    name: 'client',
    target: 'web',
    entry: {
        entrypoint: [
            'webpack-hot-middleware/client',
            './src/modules/app/client'
        ]
    },
    output: {
        publicPath: '/assets',
        filename: '[name].client.js'
    },
    optimization: {
        splitChunks: {
            minSize: 100,
            chunks: 'all',
            cacheGroups: createCacheGroups(CACHE_GROUPS.client)
        }
    },
    plugins: [
        ...([Object.keys(CACHE_GROUPS.shared)].map(dllName => (
            new webpack.DllReferencePlugin({
                context: ROOT_DIR,
                manifest: join(BIN_DIR, `${dllName}.manifest.json`)
            })
        )))
    ]
});
