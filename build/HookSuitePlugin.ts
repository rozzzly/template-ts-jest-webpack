import * as webpack from 'webpack';

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
    private id: string;
    private isFirstEmit: boolean;
    private onDone?: OnDone;
    private afterEmit?: AfterEmit;
    private afterFirstEmit?: AfterFirstEmit;
    private beforeRun?: BeforeRun;
    private onFailed?: OnFailed;
    private onInvalid?: OnInvalid;
    // private hashes

    public constructor(options: HookSuitePluginOptions) {
        this.isFirstEmit = true;
        this.id = ((options.id)
            ? options.id
            : `unnamed-${Date.now()}`
        );

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
            compiler.hooks.beforeRun.tap(HookSuitePlugin.name, (compiler2) => {
                // @ts-ignore
                this.beforeRun(compiler2, this.id);
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