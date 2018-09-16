import * as webpack from 'webpack';

import CompilerHandle from './CompilerHandle';

export default class CompilerSet<CompilerIDs extends string {
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
        if (stats.hasErrors())
    }
}
