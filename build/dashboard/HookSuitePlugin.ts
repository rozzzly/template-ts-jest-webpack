import * as webpack from 'webpack';
import Tracker from './Tracker';

export type OnDone = (stats: webpack.Stats, id: string) => void;
export type AfterEmit = (compilation: webpack.compilation.Compilation, id: string) => void;
export type AfterFirstEmit = (compilation: webpack.compilation.Compilation, id: string) => void;
export type BeforeRun = (compiler: webpack.Compiler, id: string) => void;
export type OnFailed = (error: Error, id: string) => void;
export type OnInvalid = (fileName: string, changeTime: Date, id: string) => void;

export interface HookSuitePluginOptions {
    id?: string;
    onDone?: OnDone;
    afterEmit?: AfterEmit;
    afterFirstEmit?: AfterFirstEmit;
    beforeRun?: BeforeRun;
    onFailed?: OnFailed;
    onInvalid?: OnInvalid;
}

export default class HookSuitePlugin {
    protected id: string;
    protected isFirstEmit: boolean;
    protected onDone?: OnDone;
    protected afterEmit?: AfterEmit;
    protected afterFirstEmit?: AfterFirstEmit;
    protected beforeRun?: BeforeRun;
    protected onFailed?: OnFailed;
    protected onInvalid?: OnInvalid;

    public constructor(options: HookSuitePluginOptions) {
        this.isFirstEmit = true;
        if (options.id) {
            this.id = options.id;
        } else {
            this.id = 'unnamed-' + Date.now();
        }

        if (options.onDone) {
            this.onDone = options.onDone;
        }
        if (options.afterEmit) {
            this.afterEmit = options.afterEmit;
        }
        if (options.afterFirstEmit) {
            this.afterFirstEmit = options.afterFirstEmit;
        }
        if (options.beforeRun) {
            this.beforeRun = options.beforeRun;
        }
        if (options.onFailed) {
            this.onFailed = options.onFailed;
        }
        if (options.onInvalid) {
            this.onInvalid = options.onInvalid;
        }
    }

    public apply(compiler: webpack.Compiler): void {
        // if (!compiler.name) throw new TypeError('Compiler must be named! Specify a \'name\' in the compiler\'s config');
        // else this.id = compiler.name;

        if (this.onDone) {
            compiler.hooks.done.tap(HookSuitePlugin.name, (stats) => {
                // @ts-ignore
                this.onDone(stats, this.id);
            });
        }
        if (this.afterEmit || this.afterFirstEmit) {
            if (this.afterFirstEmit) {
                if (this.afterEmit) { // hook for both `afterEmit` and `afterFirstEmit`
                    compiler.hooks.afterEmit.tap(HookSuitePlugin.name, (compilation) => {
                        // @ts-ignore
                        this.afterEmit(compilation, this.id);
                        if (this.isFirstEmit) {
                            this.isFirstEmit = false;
                            // @ts-ignore
                            this.afterFirstEmit(compilation, this.id);
                        }
                    });
                } else { // hook for `afterFirstEmit` only
                    compiler.hooks.afterEmit.tap(HookSuitePlugin.name, (compilation) => {
                        if (this.isFirstEmit) {
                            this.isFirstEmit = false;
                            // @ts-ignore
                            this.afterFirstEmit(compilation, this.id);
                        }
                    });
                }
            } else { // hook for `afterEmit` only
                compiler.hooks.afterEmit.tap(HookSuitePlugin.name, (compilation) => {
                    // @ts-ignore
                    this.afterEmit(compilation, this.id);
                });
            }
        }
        if (this.beforeRun) {
            compiler.hooks.beforeRun.tap(HookSuitePlugin.name, (_compiler) => {
                // @ts-ignore
                this.beforeRun(_compiler, this.id);
            });
        }
        if (this.onFailed) {
            compiler.hooks.failed.tap(HookSuitePlugin.name, (error) => {
                // @ts-ignore
                this.onFailed(error, this.id);
            });
        }
        if (this.onInvalid) {
            compiler.hooks.invalid.tap(HookSuitePlugin.name, (fileName, changeTime) => {
                // @ts-ignore
                this.onInvalid(fileName, changeTime, this.id);
            });
        }
    }
}

export { HookSuitePlugin };


export interface HookSuiteBridgePluginOptions extends HookSuitePluginOptions {
    id: string; // _required_ unlike HookSuitePluginOptions
    tracker: Tracker<string>; // tracker instance this will call back to
}

export class HookSuiteBridgePlugin extends HookSuitePlugin {
    protected id: string;
    protected tracker: Tracker<string>;

    public constructor({ tracker, ...opts }: HookSuiteBridgePluginOptions) {
        super({
            ...opts,
            afterEmit: (compilation, id) => {
                this.tracker.receiver.afterEmit(compilation, id);
                if (opts.afterEmit) opts.afterEmit(compilation, id);
            },
            beforeRun: (compiler, id) => {
                this.tracker.receiver.beforeRun(compiler, id);
                if (opts.beforeRun) opts.beforeRun(compiler, id);
            },
            onDone: (stats, id) => {
                this.tracker.receiver.onDone(stats, id);
                if (opts.onDone) opts.onDone(stats, id);
            },
            onFailed: (error, id) => {
                this.tracker.receiver.onFailed(error, id);
                if (opts.onFailed) opts.onFailed(error, id);
            },
            onInvalid: (fileName, changeTime, id) => {
                this.tracker.receiver.onInvalid(fileName, changeTime, id);
                if (opts.onInvalid) opts.onInvalid(fileName, changeTime, id);
            }
        });
        this.tracker = tracker;
    }
}
