import * as webpack from 'webpack';

export interface CompilerTallyBook {
    run: number;
    done: number;
    doneClean: number;
    doneDirty: number;
    emits: number;
    invalid: number;
    failed: number;
}

export type CompilerPhase = (
    | 'idle'
    | 'init'
    | 'running'
    | 'doneClean'
    | 'doneDirty'
    | 'failed'
);

export interface RunRecordStatsShorthand {
    hash?: string;
    errors?: any[];
    warnings?: any[];
    /**
     * tuple is: [filePath, fileSize]
     * note: fileSize is in bytes
     */
    emits?: [string, number][];
}

export interface RunRecordStats {
    hash: string;
    errors: any[];
    warnings: any[];
    emits: [string, number][];
}

export interface RunRecordShorthand extends RunRecordStatsShorthand {
    /** in ms */
    duration?: number;
    /** tuple is: [startTime, endTime] */
    timestamp?: [number, number];
    kind: (
        | 'idle'
        | 'init'
        | 'doneClean'
        | 'doneDirty' // build finished with errors/warnings (in code being compiled)
        | 'failed' // internal (to webpack/plugin/loader) error
    );
}

/**
 * @note External run record which ensures duration/timestamp is always there
 */
export interface RunRecord extends RunRecordShorthand {
    duration: number;
    timestamp: [number, number];
}


export default class CompilerHandle<CompilerID extends string> {
    private static MAX_RECORDS: number = 25;

    public id: CompilerID;
    public phase: CompilerPhase;
    public compiler: webpack.Compiler;
    public buildRecords: RunRecord[];

    private tally: CompilerTallyBook;
    private startedAt: number;

    public constructor(id: CompilerID) {
        this.phase = 'idle';
        this.tally = {
            run: 0,
            done: 0,
            emits: 0,
            invalid: 0,
            doneClean: 0,
            doneDirty: 0,
            failed: 0
        };
        this.buildRecords = [];
        this.startedAt = Date.now();
    }

    private addRecord(record: RunRecordShorthand): void {
        this.buildRecords.push({
            ...record,
            timestamp: record.timestamp || [ Date.now(), this.startedAt ],
            duration: record.duration || (Date.now() - this.startedAt)
        });
        // only track x number of records
        while (this.buildRecords.length > CompilerHandle.MAX_RECORDS) {
            this.buildRecords.shift();
        }
    }

    private toInit(): void {
        this.addRecord({ kind: 'idle' });
        this.startedAt = Date.now();
        this.phase = 'init';
    }

    private toRun(): void {
        if (this.tally.run === 0) {
            this.addRecord({
                kind: 'init'
            });
        }
        this.startedAt = Date.now();
        this.tally.run++;
    }

    private toFailed(error: Error): void {
        this.phase = 'failed';
        this.tally.failed++;
        this.addRecord({
            kind: 'failed',
            errors: [error]
        });
    }

    private toDoneClean(stats: RunRecordStats): void {
        this.phase = 'done';
        this.addRecord(record)
    }

    private shiftPhase(phase: Exclude<CompilerPhase, 'idle' | 'successful' | 'failed'>): void;
    private shiftPhase(
        phase: Exclude<CompilerPhase, 'idle' | 'init' | 'running'>,
        { errors, warnings }: { errors: any[], warnings: any[] }
    ): void;
    private shiftPhase(
        phase: Exclude<CompilerPhase, 'idle'>,
        { errors, warnings }: {
            errors: any[], warnings: any[]
        } = {
            errors: [], warnings: []
        }
    ): void {
        if (phase === 'init') {

            this.compiler.watch({}, () => { /* */ }); // start watching
        } else if (phase === 'running') {

        } else if (phase === 'failed') {

        }
    }
}


interface CompilerInitPhase {
    phase: 'init';
    compiler: webpack.Compiler;
    onDisk: false;
    started: number;
    finished: number;

    initTime: number;
}

interface CompilerBuildingPhase {
    phase: 'building';
    compiler: webpack.Compiler;
    onDisk: boolean;
    started: number;
    finished: number;

    initTime: number;
    warnings: [];
    errors: [];
}
interface CompilerSuccessPhase {
    phase: 'success';
    compiler: webpack.Compiler;
    started: number;
    finished: number;
    initTime: number;
    warnings: any[];
    errors: any[];
    onDisk: true;
}

interface CompilerFailurePhase {
    phase: 'failure';
    compiler: webpack.Compiler;
    started: number;
    finished: number;
    onDisk: boolean;

    initTime: number;
    errors: any[];
    warnings: any[];
}

export type CompilerHandle2= (
    | CompilerInitPhase
    | CompilerBuildingPhase
    | CompilerSuccessPhase
    | CompilerFailurePhase
);



function phaseShift(id: CompilerID2, newPhase: 'building', args?: { }): void;
function phaseShift(id: CompilerID2, newPhase: 'init', args: { compiler: webpack.Compiler }): void;
function phaseShift(id: CompilerID2, newPhase: 'success' | 'failure', args: { warnings: any[], errors: any[] }): void;
function phaseShift(id: CompilerID2, newPhase: CompilerPhase, args: { warnings?: any[], errors?: any[], compiler?: webpack.Compiler } = {}): void {
    let prevState: CompilerBuildingPhase = compilers[id] as CompilerBuildingPhase;
    switch (newPhase) {
        case 'init':
            compilers[id] = {
                phase: 'init',
                started: Date.now(),
                finished: -1,
                initTime: -1,
                onDisk: false,
                compiler: args.compiler as webpack.Compiler
            };
            break;
        case 'building':
            compilers[id] = {
                ...prevState,
                phase: 'building',
                initTime: ((prevState.initTime === -1)
                    ? Date.now() - prevState.started
                    : prevState.initTime
                ),
                started: Date.now(),
                finished: -1,
                warnings: [],
                errors: []
            };
            break;
        case 'success':
            compilers[id] = {
                ...prevState,
                phase: 'success',
                finished: Date.now(),
                warnings: args.warnings as any[],
                errors: args.errors as any[],
                onDisk: true,
            };
            break;
        case 'failure':
            compilers[id] = {
                ...prevState,
                phase: 'failure',
                finished: Date.now(),
                warnings: args.warnings as any[],
                errors: args.errors as any[],
            };
            break;
        default:
            throw new TypeError('Unexpected phase given');
            break;
    }
}

type CompilerID2 = (
    | 'shared'
    | 'client'
    | 'server'
);

let compilers: {
    [cid in CompilerID2]: CompilerHandle
} = {
    shared: {} as CompilerInitPhase,
    client: {} as CompilerInitPhase,
    server: {} as CompilerInitPhase
 };
