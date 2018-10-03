import { Omit } from 'typelevel-ts';

export type CompilerEmit = [string, number, boolean?];

export type CompilerPhase = (
    | null // prior to first run
    | 'invalid' // compilation is invalid (meaning compiler is running, or about to be)
    | 'clean' // compiled code has no errors/warnings
    | 'dirty' // compiled code has errors/warnings
    | 'failed' // internal (to webpack/plugin/loader) error led to premature abort of compilation
);
export namespace CompilerState {
    interface Base<Phase extends CompilerPhase> {
        id: string;
        phase: Phase;
        startTimestamp: number;
    }
    export interface Inactive extends Base<null> { }
    export interface Invalid extends Base<'invalid'> { }
    export interface Clean extends Base<'clean'> {
        hash: string;
        endTimestamp: number;
        duration: number;
        emits: CompilerEmit[];
    }
    export interface Dirty extends Base<'dirty'> {
        hash: string;
        endTimestamp: number;
        duration: number;
        warnings: any[];
        errors: any[];
        emits: CompilerEmit[];
    }
    export interface Failed extends Base<'failed'> {
        endTimestamp: number;
        duration: number;
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
    export type Inactive = Omit<CompilerState.Inactive, 'startTimestamp'>;
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
