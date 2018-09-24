import * as webpack from 'webpack';

import CompilerHandle from './CompilerHandle';
import { OnDone, AfterEmit, AfterFirstEmit, OnFailed, OnInvalid, BeforeCompile, CompilationParams } from './HookSuitePlugin';

export default class Tracker<CompilerIDs extends string> {

    public pool: {
        [CompilerID in CompilerIDs]: CompilerHandle<CompilerID>
    };
    private ids: CompilerIDs[];

    public receiver: {
        onDone: OnDone;
        afterEmit: AfterEmit;
        afterFirstEmit: AfterFirstEmit;
        beforeCompile: BeforeCompile;
        onFailed: OnFailed;
        onInvalid: OnInvalid;
    };

    public constructor(compilerIDs: CompilerIDs[]) {
        this.receiver = {
            onDone: this.onDone.bind(this),
            afterEmit: this.afterEmit.bind(this),
            afterFirstEmit: this.afterFirstEmit.bind(this),
            beforeCompile: this.beforeCompile.bind(this),
            onFailed: this.onFailed.bind(this),
            onInvalid: this.onInvalid.bind(this)
        };
        this.ids = compilerIDs;
        this.pool = compilerIDs.reduce((reduction, id) => ({
            ...(reduction as any),
            [id]: new CompilerHandle(id)
        }), { });
    }

    public [Symbol.iterator](): Iterator<CompilerHandle<CompilerIDs>> {
        let index = -1;
        return {
            next: () => ({
                value: this.pool[this.ids[++index]],
                done: index > this.ids.length
            })
        };
    }

    public forEach(
        iteratee: <CompilerID extends CompilerIDs>(
            value: CompilerHandle<CompilerID>,
            key: CompilerID,
            collection: { [compilerID in CompilerIDs]: CompilerHandle<compilerID> }
        ) => void
    ): void {
        this.ids.forEach(id => iteratee(this.pool[id], id, this.pool));
    }

    public map<T>(
        iteratee: <CompilerID extends CompilerIDs>(
            value: CompilerHandle<CompilerID>,
            key: CompilerID,
            collection: { [compilerID in CompilerIDs]: CompilerHandle<compilerID> }
        ) => T
    ): T[] {
        return this.ids.map(id => iteratee(this.pool[id], id, this.pool));
    }

    public reduce<R>(
        iteratee: <CompilerID extends CompilerIDs>(
            reduction: R,
            value: CompilerHandle<CompilerID>,
            key: CompilerID,
            collection: { [compilerID in CompilerIDs]: CompilerHandle<compilerID> }
        ) => R,
        initialValue?: any
    ): R {
        return this.ids.reduce((reduction, id) => iteratee(reduction, this.pool[id], id, this.pool), initialValue);
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

    private afterFirstEmit(compilation: webpack.compilation.Compilation, id: string): void {
        // noop;
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

    private beforeCompile(compilationParams: CompilationParams, id: string): void {
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
