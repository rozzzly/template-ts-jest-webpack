import * as webpack from 'webpack';

import HookSuitePlugin, { HookSuitePluginOptions } from './HookSuitePlugin';
import { Store } from './store';
import { updateCompiler } from './tracker/actions';

export interface CompilerTrackerPluginOptions extends HookSuitePluginOptions {
    id: string; // _required_ unlike HookSuitePluginOptions
    store: Store; // redux store to dispatch actions to
}

export class CompilerTrackerPlugin extends HookSuitePlugin {
    protected id: string;
    protected store: Store;

    public constructor({ store, ...opts }: CompilerTrackerPluginOptions) {
        super({
            ...opts,
            beforeCompile: (compilationParams, id) => {
                this.store.dispatch(updateCompiler({
                    id,
                    phase: 'invalid'
                }));
                if (opts.beforeCompile) opts.beforeCompile(compilationParams, id);
            },
            onDone: (stats, id) => {
                if (stats.hasErrors() || stats.hasWarnings()) {
                    // dirty
                    const $stats = stats.toJson({ chunks: false });
                    this.store.dispatch(updateCompiler({
                        id,
                        phase: 'dirty',
                        emits: [],
                        hash: $stats.hash,
                        startTimestamp: stats.startTime as any,
                        endTimestamp: stats.endTime as any,
                        warnings: $stats.warnings,
                        errors: $stats.errors
                    }));
                } else {
                    // clean
                    const $stats = stats.toJson({ chunks: false });
                    this.store.dispatch(updateCompiler({
                        id,
                        phase: 'clean',
                        emits: [],
                        hash: $stats.hash,
                        startTimestamp: stats.startTime as any,
                        endTimestamp: stats.endTime as any
                    }));
                }
                if (opts.onDone) opts.onDone(stats, id);
            },
            onFailed: (error, id) => {
                this.store.dispatch(
                    updateCompiler({
                        id,
                        phase: 'failed',
                        error
                    })
                );
                if (opts.onFailed) opts.onFailed(error, id);
            },
            onInvalid: (fileName, changeTime, id) => {
                this.store.dispatch(
                    updateCompiler({
                        id,
                        phase: 'invalid',
                        invalidatedBy: fileName
                    })
                );
                if (opts.onInvalid) opts.onInvalid(fileName, changeTime, id);
            }
        });
        this.store = store;
        // set state for this compiler to be `Inactive`
        this.store.dispatch(
            updateCompiler({
                id: this.id,
                phase: null
            })
        );
    }
}

export default CompilerTrackerPlugin;
