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


export interface ConfigHelper<Opts extends {}> {
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



export interface ConfigProxy<Opts extends {}> extends webpack.Configuration {
}


const isConfigProxy = <O extends {}>(value: unknown): value is ConfigProxy<O> => (
    (value as any)[SYM_CONFIG_PROXY_FLAG] === true
);

export type ExposeInternals<T> = (
    (T extends ConfigProxy<infer Opts>
        ? {
            opts: Opts,
            defaultOpts: Partial<Opts>,
            factory: ConfigFactory<Opts>
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

const makeHandle = <Opts extends DefaultOpts>(opts: Opts): ConfigHelper<Opts> => ({
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

export type ConfigFactory<Opts extends {}> = (handle: ConfigHelper<Opts>) => webpack.Configuration;

export interface ConfigProxyFactory {
    // signature A, AB
    <OwnOpts extends { }>(
        factory: ConfigFactory<OwnOpts & DefaultOpts>,
        defaultOpts?: Partial<OwnOpts & DefaultOpts>
    ): ConfigProxy<OwnOpts & DefaultOpts>;

    // signature B, BB
    <OwnOpts extends { }, BaseProxy extends ConfigProxy<{ }>>(
        base: BaseProxy,
        factory: ConfigFactory<OwnOpts & ExposeInternals<BaseProxy>['opts']>,
        defaultOpts?: Partial<OwnOpts & ExposeInternals<BaseProxy>['opts']>
    ): ConfigProxy<OwnOpts & ExposeInternals<BaseProxy>['opts']>;

    // signature C
    <BaseProxy extends ConfigProxy<{ }>>(
        base: BaseProxy,
        opts: Partial<ExposeInternals<BaseProxy>['opts']>
    ): ConfigProxy<ExposeInternals<BaseProxy>['opts']>;
}



export const configProxy: ConfigProxyFactory = (...args: any[]): ConfigProxy<any> => {
    let local: {
        opts: any,
        defaultOpts: any,
        factory: ConfigFactory<any>
    };

    if (args.length >= 1 && typeof args[0] === 'function') { // A, AB
        const defaultOpts = {
            mode: 'development',
            ...(
                ((args.length === 2 && typeof args[1] === 'object')
                    ? args[1]
                    : {}
                )
            )
        };

        local = {
            factory: args[0],
            opts: defaultOpts,
            defaultOpts
        };
    } else if (args.length >= 2) { // B, BB, C
        if (isConfigProxy(args[0])) { // B, BB, C
            if (typeof args[1] === 'function') { // B, BB
                const remote = exposeInternals(args[0]);
                local = {
                    ...remote
                };
                if (args.length === 3 && typeof args[2] === 'object') { // BB
                    local.defaultOpts = { ...local.defaultOpts, ...args[2] };
                }
                local.factory = (handle) => merge(
                    remote.factory(handle),
                    args[1](handle)
                );
            } else if (typeof args[1] === 'object') { // C
                const remote = exposeInternals(args[0]);
                local = { ...remote, opts: { ...remote.opts, ...args[1] } };
            } else {
                throw new TypeError('unexpected call signature!! refer to source/docs');
            }
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
};



export { join };
