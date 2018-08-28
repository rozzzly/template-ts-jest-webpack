import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import { join } from 'path';


export type ChunkGroupsShortForm = {
    [chunkName: string]: webpack.Options.CacheGroupsOptions['test']
};

export type ChunkGroupsFullForm = {
    [chunkName: string]: webpack.Options.CacheGroupsOptions;
};

export function createCacheGroups(shortForms: ChunkGroupsShortForm): ChunkGroupsFullForm {
    const chunks: webpack.Options.SplitChunksOptions['cacheGroups'] = {};
    Object.keys(shortForms).forEach(chunkName => {
        chunks[chunkName] = {
            chunks: 'all',
            name: chunkName,
            test: shortForms[chunkName]
        };
    });
    return chunks;
}

export const SYM_STRIP: unique symbol = Symbol('SYM_STRIP');
export type SYM_STRIP = typeof SYM_STRIP;

export const SYM_CONFIG_PROXY: unique symbol = Symbol('SYM_CONFIG_PROXY');
export type SYM_CONFIG_PROXY = typeof SYM_CONFIG_PROXY;

export interface ConfigProxyOptions {
    mode: 'production' | 'development';
}

export interface ConfigProxyHandle<O extends ConfigProxyOptions> {
    merge: merge.WebpackMerge;
    options: O;
    stripItems<T extends unknown[]>(...value: T): T;
    stripKeys<T extends {}>(value: T): T;
    isDev(): boolean;
    isDev<C>(consequent: C): C;
    isDev<C, A>(consequent: C, antiConsequent: A): C | A;
    isProd(): boolean;
    isProd<C>(consequent: C): C;
    isProd<C, A>(consequent: C, antiConsequent: A): C | A;
}


export type ConfigProxy<O extends ConfigProxyOptions, C extends webpack.Configuration> = (
    & C
    & {
        mutate<M extends C>(overrides?: Partial<O>): ConfigProxy<O, M>;
    }
);

const isConfigProxy = <
    O extends ConfigProxyOptions,
    C extends webpack.Configuration
>(value: unknown): value is ConfigProxy<O, C> => (
    (value as any)[SYM_CONFIG_PROXY] === true
);

const makeHandle = <
    O extends ConfigProxyOptions
>(options: O): ConfigProxyHandle<O> => ({
    merge: new Proxy(merge, {
        apply<C extends webpack.Configuration[]>(target: merge.WebpackMerge, thisArg: any, ...args: C) {
            const patchedArgs: webpack.Configuration[] = [];
            args.forEach(arg => {
                if (isConfigProxy<O, C[number]>(arg)) {
                    patchedArgs.push(arg.mutate(options));
                } else {
                    patchedArgs.push(arg);
                }
            });
            return merge(...patchedArgs);
        }
    }),
    options: { ...(options as any) },
    stripItems<T extends any[]>(...values: T): T {
        return values.reduce((reduction, value) => (
            ((value === SYM_STRIP)
                ? [...reduction]
                : [...reduction, value]
            )
        ), []);
    },
    stripKeys<T extends {}>(value: T): T {
        return ((Object.keys(value))
            .reduce((reduction, key) => (
                (((value as any)[key] === SYM_STRIP)
                    ? { ...(reduction as any) }
                    : { ...(reduction as any), [key]: (value as any)[key] }
                )
            ), {} as T)
        );
    },
    isDev<C, A>(
        consequent: C | SYM_STRIP = SYM_STRIP,
        antiConsequent: A | SYM_STRIP = SYM_STRIP
    ): C | A | boolean {
        if (consequent === SYM_STRIP) {
            return options.mode === 'development';
        } else {
            return ((options.mode === 'development')
                ? consequent
                : antiConsequent as A
            );
        }
    },
    isProd<C, A>(
        consequent: C | SYM_STRIP = SYM_STRIP,
        antiConsequent: A | SYM_STRIP = SYM_STRIP
    ): C | A | boolean {
        if (consequent === SYM_STRIP) {
            return options.mode === 'production';
        } else {
            return ((options.mode === 'production')
                ? consequent
                : antiConsequent as A
            );
        }
    }
});

export function configProxy<
    O extends ConfigProxyOptions,
    C extends webpack.Configuration
>(
    config: (handle: ConfigProxyHandle<O>) => C,
    options: O = { mode: 'development' } as O
): ConfigProxy<O, C> {
    console.log(options);
    const cfg = config(makeHandle(options));
    const proxy = new Proxy(cfg, {
        get(target, key: keyof C) {
            if (key === 'mutate') {
                return (optionOverrides = {})  => {
                    console.log({ optionOverrides, options });
                    return configProxy(config, { ...(options as any), ...optionOverrides });
                };
            } else if (key === SYM_CONFIG_PROXY) {
                return true;
            } else {
                return target[key];
            }
        }
    });
    return proxy as ConfigProxy<O, C>;
}

export { join };