import * as webpack from 'webpack';

import CompilerHandle from './CompilerHandle';
import { OnDone, AfterEmit, AfterFirstEmit, BeforeRun, OnFailed, OnInvalid } from './HookSuitePlugin';

export default class Tracker<CompilerIDs extends string> {
    public pool: {
        [CompilerID in CompilerIDs]: CompilerHandle<CompilerID>
    };

    public receiver: {
        onDone: OnDone;
        afterEmit: AfterEmit;
        beforeRun: BeforeRun;
        onFailed: OnFailed;
        onInvalid: OnInvalid;
    };

    public constructor(compilerIDs: CompilerIDs[]) {
        this.receiver = {
            onDone: this.onDone,
            afterEmit: this.afterEmit,
            beforeRun: this.beforeRun,
            onFailed: this.onFailed,
            onInvalid: this.onInvalid
        };

        this.pool = compilerIDs.reduce((reduction, id) => ({
            ...(reduction as any),
            [id]: new CompilerHandle(id)
        }), { });
    }

    private checkID(id: string): CompilerIDs {
        if (id in this.pool) return id as CompilerIDs;
        else {
            /// TODO ::: debate on the fly additions vs
            throw new ReferenceError('Unrecognized Compiler ID!!');
        }
    }

    private onDone(stats: webpack.Stats, id: string): void {
        const $id = this.checkID(id);
        if (stats.hasErrors() || stats.hasWarnings()) {
            const $stats = stats.toJson({ chunks: false });
            this.pool[$id].doneDirty({
                hash: $stats.hash,
                errors: $stats.errors,
                warnings: $stats.warnings,
                emits: []
            });
        } else {
            const $stats = stats.toJson({ chunks: false });
            this.pool[$id].doneClean({
                hash: $stats.hash,
                errors: $stats.errors,
                warnings: $stats.warnings,
                emits: []
            });
        }
    }

    private afterEmit(compilation: webpack.compilation.Compilation, id: string): void {
        const $id = this.checkID(id);
        /// TODO ::: pass some useful data
        this.pool[$id].emitted({
            emits: [],
            errors: [],
            warnings: [],
            hash: String(compilation.hash)
        });
    }

    private beforeRun(compiler: webpack.Compiler, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].start();
    }

    private onFailed(error: Error, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].failed(error);
    }

    private onInvalid(fileName: string, changeTime: Date, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].invalidated(fileName, changeTime);
    }
}
