import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import baseCfg from './base';
import { CACHE_GROUPS, ROOT_DIR, BIN_DIR } from '../constants';
import { join } from 'path';

export default merge(baseCfg, {
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
    plugins: [
        ...([Object.keys(CACHE_GROUPS.shared)].map(dllName => (
            new webpack.DllReferencePlugin({
                context: ROOT_DIR,
                manifest: join(BIN_DIR, `${dllName}.manifest.json`)
            })
        )))
    ]
});
