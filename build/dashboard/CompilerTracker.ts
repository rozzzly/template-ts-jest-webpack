import * as webpack from 'webpack';

import CompilerHandle from './CompilerHandle';
import { OnDone, OnFailed, OnInvalid, BeforeCompile, CompilationParams } from './HookSuitePlugin';

export default class CompilerTracker<CompilerIDs extends string> {

    public pool: {
        [CompilerID in CompilerIDs]: CompilerHandle<CompilerID>
    };
    private ids: CompilerIDs[];
    private running: number;
    private runnerCbTimer: any;
    public runnerCb: null | (() => void);


    public receiver: {
        onDone: OnDone;
        beforeCompile: BeforeCompile;
        onFailed: OnFailed;
        onInvalid: OnInvalid;
    };

    public constructor(compilerIDs: CompilerIDs[]) {
        this.receiver = {
            onDone: this.onDone.bind(this),
            beforeCompile: this.beforeCompile.bind(this),
            onFailed: this.onFailed.bind(this),
            onInvalid: this.onInvalid.bind(this)
        };
        this.ids = compilerIDs;
        this.running = 0;
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
            this.pool[$id].doneDirty(stats);
        } else {
            this.pool[$id].doneClean(stats);
        }
        this.running--;
        this.updateRunnerCb();
    }

    private beforeCompile(compilationParams: CompilationParams, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].start();
        this.running++;
        this.updateRunnerCb();
    }

    private onFailed(error: Error, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].failed(error);
    }

    private onInvalid(fileName: string, changeTime: Date, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].invalidated(fileName, changeTime);
    }

    private callRunnerCb(): void {
        if (this.runnerCb) {
            this.runnerCb();
        }
    }

    private updateRunnerCb(): void {
        if (this.runnerCb) {
            if (this.running === 0 && this.runnerCbTimer) {
                clearInterval(this.runnerCbTimer);
            } else if (this.running >= 1 && !this.runnerCbTimer) {
                this.runnerCbTimer = setInterval(() => this.callRunnerCb(), 150);
            }
            this.callRunnerCb();
        } else {
            if (this.runnerCbTimer) {
                clearInterval(this.runnerCbTimer);
            }
        }
    }
}
