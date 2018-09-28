import * as webpack from 'webpack';

export interface CompilerTallyBook {
    run: number;
    done: number;
    doneClean: number;
    doneDirty: number;
    emit: number;
    invalid: number;
    failed: number;
}

export type CompilerPhase = (
    | null /// prior to first run
    | 'idle' // between runs
    | 'running' // running
);



export interface CompilationRecordStatsShorthand {
    hash?: string;
    errors?: any[];
    warnings?: any[];
    /**
     * tuple is: [filePath, fileSize]
     * note: fileSize is in bytes
     */
    emits?: [string, number][];
}

export interface CompilationRecordStats {
    hash: string;
    errors: any[];
    warnings: any[];
    emits: [string, number][];
}

export interface CompilationRecordShorthand extends CompilationRecordStatsShorthand {
    /** in ms */
    duration?: number;
    /** tuple is: [startTime, endTime] */
    timestamp?: [number, number];
    kind: CompilationStatus | 'init' | 'emitted';
}

/**
 * @note External run record which ensures duration/timestamp is always there
 */
export interface CompilationRecord extends CompilationRecordShorthand {
    duration: number;
    timestamp: [number, number];
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

    export interface Inactive extends Base<null> {
    }
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
        hash: string;
        end: number;
        error: any;
        emits: CompilerEmit[];
    }
    export interface Invalid extends Base<'invalid'> { }
    interface Base<Status extends CompilationStatus> {
        status: Status;
        start: number;
        duration: number;
        end?: number;
    }
}
    export type CompilerState = (
        | CompilerState.Inactive
        | CompilerState.Invalid
        | CompilerState.Clean
        | CompilerState.Dirty
        | CompilerState.Failed
    );
// }
const lol: CompilerState = {
    status: null,
    duration: 4,
    start: 3
};
//const foo: CompilerState = undefined as any;
//foo.

const staticDuration: <Status extends CompilerState.CompilationStatus, State extends {
    status: Status;
    start: number;
    end?: number;
    [key: string]: any;
}>(state: State) => State & { duration: number; end: number; } = ({ end = Date.now(), ...rest}: any) => ({
    ...rest,
    end,
    duration: end - rest.start // discard any value from duration --> might contain old value spread out of getter
});
const dynamicDuration: <Status extends CompilerState.CompilationStatus, State extends {
    status: Status;
    start?: number;
    [key: string]: any;
}>(state: State) => State & { start: number; duration: number }  = ({ start = Date.now(), ...rest }: any) => ({
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
                // will have no effect if `end` is already set (it's idempotent)
                this.history[this.history.length - 1] = staticDuration(value);
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
        this.phase = null;
        this.status = null;
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
        this.state = dynamicDuration({
            status: 'invalid'
        });
    }

    public failed(error: Error): void {
        this.tally.failed++;
        this.record({
            kind: 'failed',
            errors: [error]
        });
        this.phase = 'idle';
        this.status = 'failed';
    }

    public doneClean(stats: CompilationRecordStats): void {
        this.tally.done++;
        this.tally.doneClean++;
        this.state = staticDuration({
            status: 'clean'
        });
        this.record({
            kind: 'clean',
            ...stats
        });
        this.phase = 'idle';
        this.status = 'clean';
    }

    public doneDirty(stats: CompilationRecordStats): void {
        this.tally.done++;
        this.tally.doneDirty++;
        this.record({
            kind: 'dirty',
            ...stats
        });
        this.phase = 'idle';
        this.status = 'dirty';
    }

    public invalidated(fileName: string, changeTime: Date): void {
        this.tally.invalid++;
        this.status = 'invalid';
    }

    public emitted(stats: CompilationRecordStats) {
        this.tally.emit++;
        this.record({
            kind: 'emitted',
            ...stats
        });
    }

    private resetClock(): void {
        this.startedAt = Date.now();
    }
}
