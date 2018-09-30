import * as webpack from 'webpack';

const asTimestamp: (value?: Date | number) => number = (value) => (
    ((value === undefined)
        ? -1
        : ((typeof value === 'number')
            ? value
            : value.valueOf()
        )
    )
);

export interface CompilerTallyBook {
    run: number;
    done: number;
    doneClean: number;
    doneDirty: number;
    emit: number;
    invalid: number;
    failed: number;
}

export type CompilerEmit = [string, number, boolean?];
export namespace CompilerState {
    export type CompilationStatus = (
        | null // prior to first run
        | 'invalid' // compilation is invalid (meaning compiler is running, or about to be)
        | 'clean' // compiled code has no errors/warnings
        | 'dirty' // compiled code has errors/warnings
        | 'failed' // internal (to webpack/plugin/loader) error led to premature abort of compilation
    );
    interface Base<Status extends CompilationStatus> {
        status: Status;
        start: number;
        duration: number;
        end?: number;
    }
    export interface Inactive extends Base<null> { }
    export interface Invalid extends Base<'invalid'> { }
    export interface Clean extends Base<'clean'> {
        hash: string;
        end: number;
        emits: CompilerEmit[];
    }
    export interface Dirty extends Base<'dirty'> {
        hash: string;
        end: number;
        warnings: any[];
        errors: any[];
        emits: CompilerEmit[];
    }
    export interface Failed extends Base<'failed'> {
        end: number;
        error: any;
    }
    export type Lookup<Status extends CompilationStatus> = (
        (Status extends 'failed'
            ? Failed
            : (Status extends 'dirty'
                ? Dirty
                : (Status extends 'clean'
                    ? Clean
                    : (Status extends Invalid
                        ? Invalid
                        : Inactive
                    )
                )
            )
        )
    );

    export type State = (
        | Inactive
        | Invalid
        | Clean
        | Dirty
        | Failed
    );

}
export type CompilerState = CompilerState.State;

const staticState: <Status extends CompilerState.CompilationStatus, State extends {
    status: Status;
    start: number;
    end?: number;
    [key: string]: any;
}>(state: State) => CompilerState.Lookup<Status> = ({ end = Date.now(), ...rest }: any) => ({
    ...rest,
    end,
    duration: end - rest.start // discard any value from duration --> might contain old value spread out of getter
});
const dynamicDuration: <Status extends CompilerState.CompilationStatus, State extends {
    status: Status;
    start?: number;
    [key: string]: any;
}>(state: State) => CompilerState.Lookup<Status> = ({ start = Date.now(), ...rest }: any) => ({
    ...rest,
    start,
    get duration(): number {
        return Date.now() - start;
    }
});


export default class CompilerHandle<CompilerID extends string> {
    private static MAX_RECORDS: number = 25;

    public id: CompilerID;

    private tally: CompilerTallyBook;
    public history: CompilerState[];

    public get status(): CompilerState.CompilationStatus {
        return this.state.status;
    }

    public get state(): CompilerState {
        if (this.history.length) {
            return this.history[this.history.length - 1];
        } else {
            throw new ReferenceError('CompilerHandle.state getter called before initial state recorded?');
        }
    }

    public set state(value: CompilerState) {
        if (this.history.length) {
            const state = this.history[this.history.length - 1];
            if (state.status === value.status) {
                // update in-place
                this.history[this.history.length - 1] = value;
            } else {
                // push new state
                this.history.push(value);
                // only track x number of records, discard oldest records first
                while (this.history.length > CompilerHandle.MAX_RECORDS) {
                    this.history.shift();
                }
            }
         }  else {
            throw new ReferenceError('CompilerHandle.state setter called before initial state recorded?');
        }
    }


    public constructor(id: CompilerID) {
        this.id = id;
        this.tally = {
            run: 0,
            done: 0,
            emit: 0,
            invalid: 0,
            doneClean: 0,
            doneDirty: 0,
            failed: 0
        };
        this.history = [dynamicDuration({
            status: null
        })];
    }

    public start(): void {
        this.tally.run++;
        this.normalizeDynamicState();
        this.state = dynamicDuration({
            status: 'invalid'
        });
    }

    public failed(error: Error): void {
        this.tally.failed++;
        this.normalizeDynamicState();
        this.state = staticState({
            status: 'failed',
            error: error,
            start: this.state.start,
            end: this.state.end
        });
    }

    public doneClean(stats: webpack.Stats): void {
        this.tally.done++;
        this.tally.doneClean++;

        const $stats = stats.toJson({ chunks: false });
        this.normalizeDynamicState(stats);
        this.state = staticState({
            status: 'clean',
            hash: stats.hash,
            emits: [],
            start: asTimestamp(stats.startTime),
            end: asTimestamp(stats.endTime)
        });
    }

    public doneDirty(stats: webpack.Stats): void {
        this.tally.done++;
        this.tally.doneDirty++;
        const $stats = stats.toJson({ chunks: false });
        this.normalizeDynamicState(stats);
        this.state = staticState({
            status: 'dirty',
            hash: stats.hash,
            emits: [],
            start: asTimestamp(stats.startTime),
            end: asTimestamp(stats.endTime),
            errors: $stats.errors,
            warnings: $stats.warnings,
        });
    }

    public invalidated(fileName: string, changeTime: Date): void {
        this.tally.invalid++;
        this.state = dynamicDuration({
            status: 'invalid'
        });
    }

    private normalizeDynamicState(stats?: webpack.Stats): void {
        if (this.state.status === 'invalid') {
            if (stats && stats.startTime && stats.endTime) {
                this.state = staticState({
                    ...this.state,
                    start: asTimestamp(stats.startTime),
                    end: asTimestamp(stats.endTime)
                });
            } else { // use own timestamps
                this.state = staticState({
                    ...this.state
                });
            }
        } else if (this.state.status === null) {
            this.state = staticState({
                ...this.state
            });
        } else {
            throw new Error('unexpected status');
        }
    }
}
