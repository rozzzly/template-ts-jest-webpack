import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';
import baseCfg from './base';
import { CACHE_GROUPS, ROOT_DIR, BIN_DIR } from '../constants';
import { configProxy, join, createCacheGroups } from '../util';
import HookSuitePlugin from '../dashboard/HookSuitePlugin';

export default configProxy<{
    hookSuite: HookSuitePlugin
}, typeof baseCfg>(baseCfg, $ => ({
    name: 'server',
    target: 'node',
    entry: {
        entrypoint: $.isDev([
            'webpack/hot/poll?1000',
            './src/modules/app/server/entrypoint'
        ], './src/modules/app/server/entrypoint')
    },
    output: {
        filename: $.isDev('[name].server.js', '[name]_[hash:6].server.js'),
        library: 'init',
        libraryExport: 'default',
        libraryTarget: 'commonjs2'
    },
    optimization: {
        // runtimeChunk: 'single',
        splitChunks: {
            minSize: 100,
            chunks: 'all',
            cacheGroups: createCacheGroups(CACHE_GROUPS.server)
        }
    },
    externals: [nodeExternals({
        whitelist: [
            'webpack/hot/poll?1000'
        ]
    })],
    plugins: [
        ...Object.keys(CACHE_GROUPS.shared).map(dllName => (
            new webpack.DllReferencePlugin({
                context: ROOT_DIR,
                manifest: join(BIN_DIR, `${dllName}.manifest.json`)
            })
        )),
        $.opts.hookSuite
    ]
}));
