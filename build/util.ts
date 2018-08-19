
import * as webpack from 'webpack';
import { join } from 'path';
import { Options } from 'webpack';
import * as merge from 'webpack-merge';

export type ChunkGroupsShortForm = {
    [chunkName: string]: Options.CacheGroupsOptions['test']
};

export type ChunkGroupsFullForm = {
    [chunkName: string]: Options.CacheGroupsOptions;
};

export function createCacheGroups(shortForms: ChunkGroupsShortForm): ChunkGroupsFullForm {
    const chunks: Options.SplitChunksOptions['cacheGroups'] = {};
    Object.keys(shortForms).forEach(chunkName => {
        chunks[chunkName] = {
            chunks: 'all',
            name: chunkName,
            test: shortForms[chunkName]
        };
    });
    return chunks;
}

export const SYM_STRIP_IF_ENCOUNTERED: unique symbol = Symbol('SYM_STRIP_IF_ENCOUNTERED');
export type SYM_STRIP_IF_ENCOUNTERED = typeof SYM_STRIP_IF_ENCOUNTERED;

export interface ConfigProxyOptions {
    mode: 'production' | 'development';
}

export interface ConfigProxyHandle<O extends ConfigProxyOptions> {
    merge: merge.WebpackMerge;
    options: O;
    STRIP: SYM_STRIP_IF_ENCOUNTERED;
    isDev(): boolean;
    isDev<C>(consequent: C): boolean;
    isDev<C, A>(consequent: C, antiConsequent: A): C | A;
    isProd(): boolean;
    isProd<C>(consequent: C): C;
    isProd<C, A>(consequent: C, antiConsequent: A): C | A;
}

export interface ConfigProxyConfig<O extends ConfigProxyOptions, C extends webpack.Configuration> {
    (options?: Partial<O>): C;
}

export type ConfigProxy<O extends ConfigProxyOptions, C extends webpack.Configuration> = (
    & ConfigProxyConfig<O, C>
    & C
);

const makeHandle = <O extends ConfigProxyOptions>(options: O): ConfigProxyHandle<O> => ({
    merge,
    options,
    STRIP: SYM_STRIP_IF_ENCOUNTERED,
    isDev<C, A>(consequent?: C): C | A | boolean {
        return false;
    },
    isProd<C, A>(consequent?: C): C | A | boolean {
        return false;
    }
});

export function MakeConfigProxy<
    O extends ConfigProxyOptions,
    C extends webpack.Configuration
>(config: (handle: ConfigProxyHandle<O>) => C): ConfigProxyConfig<O, C> {

    const cfg = config(makeHandle({ mode: 'development'} as O));
    return {} as any;
}

export { join };