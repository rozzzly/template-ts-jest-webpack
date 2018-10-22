import { Omit } from 'typelevel-ts';

export type CompilationEmit = [string, number, boolean?];

export type CompilerPhase = (
    | null // prior to first run
    | 'invalid' // compilation is invalid (meaning compiler is running, or about to be)
    | 'clean' // compiled code has no errors/warnings
    | 'dirty' // compiled code has errors/warnings
    | 'failed' // internal (to webpack/plugin/loader) error led to premature abort of compilation
);

export namespace Time {
    export interface Instant {
        startTimestamp: number;
    }
    export interface Period extends Instant {
        startTimestamp: number;
        endTimestamp: number;
        duration: number;
    }
}

export type CompilerID = string;

export namespace CompilerState {

    interface Base<Phase extends CompilerPhase> {
        id: CompilerID;
        phase: Phase;
    }
    export interface Inactive extends Base<null> { }
    export interface Invalid extends Base<'invalid'>, Time.Instant {
        invalidatedBy?: string;
    }
    export interface Clean extends Base<'clean'>, Time.Period {
        hash: string;
    }
    export interface Dirty extends Base<'dirty'>, Time.Period {
        hash: string;
        warnings: number;
        errors: number;
    }
    export interface Failed extends Base<'failed'>, Time.Period {
        error: any;
    }
    export type Lookup<Phase extends CompilerPhase> = (
        (Phase extends 'failed'
            ? Failed
            : (Phase extends 'dirty'
                ? Dirty
                : (Phase extends 'clean'
                    ? Clean
                    : (Phase extends Invalid
                        ? Invalid
                        : Inactive
                    )
                )
            )
        )
    );

    export type Union = (
        | Inactive
        | Invalid
        | Clean
        | Dirty
        | Failed
    );

}

export type CompilerState = CompilerState.Union;

export namespace CompilerStatePatch {
    export type Inactive = CompilerState.Inactive;
    export type Invalid = Omit<CompilerState.Invalid, 'startTimestamp'>;
    export type Clean = Omit<CompilerState.Clean, 'duration'>;
    export type Dirty = (
        & Omit<CompilerState.Dirty, 'duration' | 'errors' | 'warnings'>
        & {
            warnings: any[];
            errors: any[];
        }
    );
    export type Failed = Omit<CompilerState.Failed, 'startTimestamp' | 'endTimestamp' | 'duration'>;

    export type Lookup<Phase extends CompilerPhase> = (
        (Phase extends 'failed'
            ? Failed
            : (Phase extends 'dirty'
                ? Dirty
                : (Phase extends 'clean'
                    ? Clean
                    : (Phase extends Invalid
                        ? Invalid
                        : Inactive
                    )
                )
            )
        )
    );

    export type Union = (
        | Inactive
        | Invalid
        | Clean
        | Dirty
        | Failed
    );
}

export type CompilerStatePatch = CompilerStatePatch.Union;

export type CompilerStateMap = Record<CompilerID, CompilerState>;

export type CompilationHash = string;
export interface CompilationRecord extends Time.Period {
    compiler: string;
    hash: string;
    errors: any[];
    warnings: any[];
    emits: CompilationEmit[];
}
export type CompilationRecordMap = Record<string, CompilationRecord>;

export interface State {
    activeCompilers: number;
    compilers: CompilerStateMap;
    builds: {
        entries: CompilationRecordMap;
        index: CompilationHash[];
    };
}
export default State;

export const initialState: State = {
    activeCompilers: 0,
    compilers: {},
    builds: {
        entries: {},
        index: []
    }
};
