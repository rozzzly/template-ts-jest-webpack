import * as webpack from 'webpack';
import Tracker from './Tracker';

export interface CompilationParams {
    normalModuleFactory: webpack.compilation.NormalModuleFactory;
    contextModuleFactor: webpack.compilation.ContextModuleFactory;
    compilationDependencies: Set<webpack.compilation.Dependency>;
}

export type OnDone = (stats: webpack.Stats, id: string) => void;
export type AfterEmit = (compilation: webpack.compilation.Compilation, id: string) => void;
export type AfterFirstEmit = (compilation: webpack.compilation.Compilation, id: string) => void;
export type OnRun = (compiler: webpack.Compiler, id: string) => void;
export type OnWatchRun = (compiler: webpack.Compiler, id: string) => void;
export type BeforeRun = (compiler: webpack.Compiler, id: string) => void;
export type BeforeCompile = (compilationParams: CompilationParams, id: string) => void;
export type OnCompile = (compilationParams: CompilationParams, id: string) => void;
export type AfterCompile = (compilation: webpack.compilation.Compilation, id: string) => void;
export type OnCompilation = (compilation: webpack.compilation.Compilation, id: string) => void;
export type OnThisCompilation = (compilation: webpack.compilation.Compilation, id: string) => void;
export type OnFailed = (error: Error, id: string) => void;
export type OnInvalid = (fileName: string, changeTime: Date, id: string) => void;

export interface HookSuitePluginOptions {
    id?: string;
    onDone?: OnDone;
    afterEmit?: AfterEmit;
    afterFirstEmit?: AfterFirstEmit;
    onRun?: OnRun;
    onWatchRun?: OnWatchRun;
    beforeRun?: BeforeRun;
    beforeCompile?: BeforeCompile;
    onCompile?: OnCompile;
    afterCompile?: AfterCompile;
    onCompilation?: OnCompilation;
    onThisCompilation?: OnThisCompilation;
    onFailed?: OnFailed;
    onInvalid?: OnInvalid;
}


export default class HookSuitePlugin {
    protected id: string;
    protected isFirstEmit: boolean;

    protected onDone?: OnDone;
    protected afterEmit?: AfterEmit;
    protected afterFirstEmit?: AfterFirstEmit;
    protected onRun?: OnRun;
    protected onWatchRun?: OnWatchRun;
    protected beforeRun?: BeforeRun;
    protected beforeCompile?: BeforeCompile;
    protected onCompile?: OnCompile;
    protected afterCompile?: AfterCompile;
    protected onCompilation?: OnCompilation;
    protected onThisCompilation?: OnThisCompilation;
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
        if (options.onRun) {
            this.onRun = options.onRun;
        }
        if (options.onWatchRun) {
            this.onRun = options.onWatchRun;
        }
        if (options.beforeRun) {
            this.beforeRun = options.beforeRun;
        }
        if (options.beforeCompile) {
            this.beforeCompile = options.beforeCompile;
        }
        if (options.onCompile) {
            this.onCompile = options.onCompile;
        }
        if (options.afterCompile) {
            this.afterCompile = options.afterCompile;
        }
        if (options.onCompilation) {
            this.onCompilation = options.onCompilation;
        }
        if (options.onThisCompilation) {
            this.onThisCompilation = options.onThisCompilation;
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
        if (this.onRun) {
            compiler.hooks.run.tap(HookSuitePlugin.name, (_compiler) => {
                // @ts-ignore
                this.onRun(_compiler, this.id);
            });
        }
        if (this.onWatchRun) {
            compiler.hooks.watchRun.tap(HookSuitePlugin.name, (_compiler) => {
                // @ts-ignore
                this.onWatchRun(_compiler, this.id);
            });
        }
        if (this.beforeRun) {
            compiler.hooks.beforeRun.tap(HookSuitePlugin.name, (_compiler) => {
                // @ts-ignore
                this.beforeRun(_compiler, this.id);
            });
        }
        if (this.beforeCompile) {
            compiler.hooks.beforeCompile.tap(HookSuitePlugin.name, (compilationParams) => {
                // @ts-ignore
                this.beforeCompile(compilationParams, this.id);
            });
        }
        if (this.onCompile) {
            compiler.hooks.compile.tap(HookSuitePlugin.name, (compilationParams) => {
                // @ts-ignore
                this.onCompile(compilationParams, this.id);
            });
        }
        if (this.afterCompile) {
            compiler.hooks.afterCompile.tap(HookSuitePlugin.name, (compilation) => {
                // @ts-ignore
                this.afterCompile(compilation, this.id);
            });
        }
        if (this.onCompilation) {
            compiler.hooks.compilation.tap(HookSuitePlugin.name, (compilation) => {
                // @ts-ignore
                this.onCompilation(compilation, this.id);
            });
        }
        if (this.onThisCompilation) {
            compiler.hooks.thisCompilation.tap(HookSuitePlugin.name, (compilation) => {
                // @ts-ignore
                this.onTHisCompilation(compilation, this.id);
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
            beforeCompile: (compilationParams, id) => {
                this.tracker.receiver.beforeCompile(compilationParams, id);
                if (opts.beforeCompile) opts.beforeCompile(compilationParams, id);
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
