import * as webpack from 'webpack';

import CompilerHandle from './CompilerHandle';

export default class CompilerSet<CompilerIDs extends string> {
    public pool: {
        [CompilerID in CompilerIDs]: CompilerHandle<CompilerID>
    };


    public constructor(compilerIDs: CompilerIDs[]) {
        this.pool = compilerIDs.reduce((reduction, id) => ({
            ...(reduction as any),
            [id]: new CompilerHandle(id)
        }), { });
    }

    private checkID(id: string): CompilerIDs {
        if (id in this.pool) return id as CompilerIDs;
        else throw new ReferenceError('Unrecognized Compiler ID Error');
    }

    public onDone(stats: webpack.Stats, id: string): void {
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

    public afterEmit(compilation: webpack.compilation.Compilation, id: string): void {
        const $id = this.checkID(id);
        /// TODO ::: pass some useful data
        this.pool[$id].emitted({
            emits: [],
            errors: [],
            warnings: [],
            hash: String(compilation.hash)
        });
    }

    public beforeRun(compiler: webpack.Compiler, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].start();
    }

    public onFailed(error: Error, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].failed(error);
    }

    public onInvalid(fileName: string, changeTime: Date, id: string): void {
        const $id = this.checkID(id);
        this.pool[$id].invalidated(fileName, changeTime);
    }
}
