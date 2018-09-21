import * as webpack from 'webpack';
import * as merge from 'webpack-merge';

import { Spread } from 'typical-ts/src/object/Spread';
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

export const SYM_CONFIG_PROXY_FLAG: unique symbol = Symbol('SYM_CONFIG_PROXY_FLAG');
export type SYM_CONFIG_PROXY_FLAG = typeof SYM_CONFIG_PROXY_FLAG;
export const SYM_CONFIG_PROXY_INTERNAL: unique symbol = Symbol('SYM_CONFIG_PROXY_INTERNAL');
export type SYM_CONFIG_PROXY_INTERNAL = typeof SYM_CONFIG_PROXY_INTERNAL;


export interface ConfigProxyHandle<Opts extends {}> {
    opts: Opts;
    stripItems<T extends unknown[]>(...value: T): T;
    stripKeys<T extends {}>(value: T): T;
    isDev(): boolean;
    isDev<C>(consequent: C): C;
    isDev<C, A>(consequent: C, antiConsequent: A): C | A;
    isProd(): boolean;
    isProd<C>(consequent: C): C;
    isProd<C, A>(consequent: C, antiConsequent: A): C | A;
}



export interface ConfigProxy<Opts extends {} = {}> extends webpack.Configuration {
}


const isConfigProxy = <O extends {}>(value: unknown): value is ConfigProxy<O> => (
    (value as any)[SYM_CONFIG_PROXY_FLAG] === true
);

export type ExposeInternals<T> = (
    (T extends ConfigProxy<infer Opts>
        ? {
            opts: Opts,
            defaultOpts: Partial<Opts>,
            factory: ConfigProxyFactory<Opts>
        }
        : never
    )
);

const exposeInternals = <C extends ConfigProxy<any>>(value: C): ExposeInternals<C> => (
    ((isConfigProxy(value))
        ? (value as any)[SYM_CONFIG_PROXY_INTERNAL]
        : (() => { throw new TypeError('Attempted extract opts from a non-config proxy!!'); })()
    )
);

const makeHandle = <Opts extends DefaultOpts>(opts: Opts): ConfigProxyHandle<Opts> => ({
    opts: opts as Opts,
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
            return opts.mode === 'development';
        } else {
            return ((opts.mode === 'development')
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
            return opts.mode === 'production';
        } else {
            return ((opts.mode === 'production')
                ? consequent
                : antiConsequent as A
            );
        }
    }
});

export interface DefaultOpts {
    mode: 'development' | 'production';
}


export type ConfigProxyFactory<Opts extends {}> = (handle: ConfigProxyHandle<Opts>) => webpack.Configuration;



export interface ConfigProxyConstructor {
    merge<OwnOpts extends { }, BaseProxy extends ConfigProxy<any>>(
        base: BaseProxy,
        factory: ConfigProxyFactory<OwnOpts & ExposeInternals<BaseProxy>['opts']>,
        defaultOpts?: Partial<OwnOpts & ExposeInternals<BaseProxy>['opts']>
    ): ConfigProxy<OwnOpts & ExposeInternals<BaseProxy>['opts']>;
    <OwnOpts extends { }>(
        factory: ConfigProxyFactory<OwnOpts & DefaultOpts>,
        defaultOpts?: Partial<OwnOpts & DefaultOpts>
    ): ConfigProxy<OwnOpts & DefaultOpts>;


    // <OwnOpts extends { }, BaseProxy = unknown>(
    //     arg0: ConfigProxyFactory<OwnOpts & DefaultOpts> | BaseProxy,
    //     defaultOpts?: Partial<OwnOpts & DefaultOpts> | ConfigProxyFactory<OwnOpts & ExposeInternals<BaseProxy>['opts']>
    // ): ConfigProxy<OwnOpts & DefaultOpts>;
    // (...args: any[]): ConfigProxy<{}>;
    // <OwnOpts extends { }, Opts = OwnOpts & DefaultOpts>(
    //     base: webpack.Configuration,
    //     factory: ConfigProxyFactory<Opts>,
    //     defaultOpts?: Partial<Opts>
    // ): ConfigProxy<Opts>;
    // <Opts extends {}, BaseProxy extends ConfigProxy<Opts>>(
    //     base: BaseProxy,
    //     opts: Opts
    // ): ConfigProxy<Opts>;
}



export const configProxy: ConfigProxyConstructor = (...args: any[]): ConfigProxy<any> => {
    let local: {
        opts: any,
        defaultOpts: any,
        factory: ConfigProxyFactory<any>
    };

    if (args.length >= 1 && typeof args[0] === 'function') { // A, A+
        const defaultOpts = ((args.length === 2 && typeof args[1] === 'object') // A+ or use default
            ? args[1]
            : { mode: 'development' }
        );
        local = {
            factory: args[0],
            opts: defaultOpts,
            defaultOpts
        };
    } else if (args.length >= 2) { // B, B+, C, C+, D
        if (isConfigProxy(args[0])) { // C, C+, D
            if (typeof args[1] === 'function') { // C, C+
                const remote = exposeInternals(args[0]);
                local = {
                    ...remote
                };
                if (args.length === 3 && typeof args[2] === 'object') {
                    local.defaultOpts = { ...local.defaultOpts, ...args[2] };
                }
                local.factory = (handle) => merge(
                    remote.factory(handle),
                    args[1](handle)
                );
            } else if (typeof args[1] === 'object') { // D
                const remote = exposeInternals(args[0]);
                local = { ...remote, opts: { ...remote.opts, ...args[1] } };
            } else {
                throw new TypeError('unexpected call signature!! refer to source/docs');
            }
        } else if (typeof args[0] === 'object' && typeof args[1] === 'function') { // B, B+
            const defaultOpts = ((args.length === 3 && typeof args[2] === 'object') // B+ or use default
                ? args[2]
                : { mode: 'development' }
            );
            local = {
                factory: (handle) => merge(
                    args[0], args[1](handle)
                ),
                opts: defaultOpts,
                defaultOpts
            };
        } else {
            throw new TypeError('unexpected call signature!! refer to source/docs');
        }
    } else {
        throw new TypeError('unexpected call signature!! refer to source/docs');
    }

    const instance = local.factory(makeHandle({ ...local.defaultOpts, ...local.opts }));

    const proxy = new Proxy(instance, {
        get(target, key: keyof webpack.Configuration | SYM_CONFIG_PROXY_FLAG | SYM_CONFIG_PROXY_INTERNAL) {
            if (key === SYM_CONFIG_PROXY_FLAG) {
                return true;
            } else if (key === SYM_CONFIG_PROXY_INTERNAL) {
                return local;
            } else {
                return target[key];
            }
        }
    });
    return proxy;
}



export { join };
