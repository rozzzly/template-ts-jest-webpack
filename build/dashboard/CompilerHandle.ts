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

export type CompilationStatus = (
    | null // prior to first run
    | 'invalid' // compilation is invalid (meaning compiler is running, or about to be)
    | 'clean' // compiled code has no errors/warnings
    | 'dirty' // compiled code has errors/warnings
    | 'failed' // internal (to webpack/plugin/loader) error led to premature abort of compilation
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


export default class CompilerHandle<CompilerID extends string> {
    private static MAX_RECORDS: number = 25;

    public id: CompilerID;
    public phase: CompilerPhase;
    public status: CompilationStatus;
    public compiler: webpack.Compiler;
    public records: CompilationRecord[];

    private tally: CompilerTallyBook;
    private startedAt: number;

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
        this.records = [];
        this.resetClock(); // this.startedAt = Date.now();
    }

    private record(record: CompilationRecordShorthand): void {
        this.records.push({
            ...record,
            timestamp: record.timestamp || [ this.startedAt, Date.now() ],
            duration: (record.duration
                ? record.duration
                : (record.timestamp
                    ? record.timestamp[1] - record.timestamp[0]
                    : Date.now() - this.startedAt
                )
            )
        });
        console.log(this.records[this.records.length - 1]);
        // only track x number of records, discard oldest records first
        while (this.records.length > CompilerHandle.MAX_RECORDS) {
            this.records.shift();
        }
    }

    public start(): void {
        console.log('running ' + this.phase);
        this.tally.run++;
        if (this.phase === null) {
            this.record({
                kind: 'init'
            });
        }
        this.resetClock();
        this.phase = 'running';
        this.status = 'invalid';
    }

    public failed(error: Error): void {
        this.tally.failed++;
        this.record({
            kind: 'failed',
            errors: [error]
        });
        this.phase = 'idle';
    }

    public doneClean(stats: CompilationRecordStats): void {
        this.tally.done++;
        this.tally.doneClean++;
        this.record({
            kind: 'clean',
            ...stats
        });
        this.phase = 'idle';
    }

    public doneDirty(stats: CompilationRecordStats): void {
        this.tally.done++;
        this.tally.doneDirty++;
        this.record({
            kind: 'dirty',
            ...stats
        });
        this.phase = 'idle';
    }

    public invalidated(fileName: string, changeTime: Date): void {
        this.tally.invalid++;
        this.status = 'invalid';
        console.log('invalidated', fileName);
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
