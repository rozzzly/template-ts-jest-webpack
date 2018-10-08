import { Omit } from 'typelevel-ts';

export type CompilerEmit = [string, number, boolean?];

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

export namespace CompilerState {

    interface Base<Phase extends CompilerPhase> {
        id: string;
        phase: Phase;
    }
    export interface Inactive extends Base<null> { }
    export interface Invalid extends Base<'invalid'>, Time.Instant {
        invalidatedBy?: string;
    }
    export interface Clean extends Base<'clean'>, Time.Period {
        hash: string;
        emits: CompilerEmit[];
    }
    export interface Dirty extends Base<'dirty'>, Time.Period {
        hash: string;
        warnings: any[];
        errors: any[];
        emits: CompilerEmit[];
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
    export type Dirty = Omit<CompilerState.Dirty, 'duration'>;
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

export type CompilerStateMap = Record<string, CompilerState>;

export const initialState: State = {
    idleCompilers: 0,
    compilers: {}
};

export interface State {
    idleCompilers: number;
    compilers: CompilerStateMap;
}

export default State;
