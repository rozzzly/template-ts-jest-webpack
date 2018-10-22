import State from './state';
import { Actions, ActionIDs } from './actions';
import { Reducer } from 'redux';
import { initialState } from './state';

export const reducer: Reducer<State, Actions> = (state = initialState, action) => {
    if (action.type === ActionIDs.UPDATE_COMPILER) {
        const nState = { ...state, compilers: { ...state.compilers }};
        const nCompiler = action.payload;
        const oCompiler = state.compilers[nCompiler.id] || false;

        if (nCompiler.phase === null) {
            nState.compilers[nCompiler.id] = nCompiler;
        } else if (nCompiler.phase === 'invalid') {
            nState.compilers[nCompiler.id] = {
                ...nCompiler,
                startTimestamp: Date.now()
            };
            //////////////////////////////////////////////////////////////////////////////////////////////
            /// TODO ::: consider whether to preserve `startTimestamp` and/or `invalidatedBy`
            /// if compiler `phase` is set to `invalid` when it's already invalid
            /// (ie: compilation-in-progress becomes invalidated before it can complete)
            //////////////////////////////////////////////////////////////////////////////////////////////
            // if (
            //     !nCompiler.invalidatedBy &&
            //     oCompiler &&
            //     oCompiler.phase === 'invalid'
            // ) {
            //    if (oCompiler.invalidatedBy) {
            //         // if invalidating a compilation in progress without the
            //         (nState.compilers[nCompiler.id] as any).invalidatedBy = oCompiler.invalidatedBy;
            //     }
            // }
        } else if (nCompiler.phase === 'clean') {
            nState.compilers[nCompiler.id] = {
                ...nCompiler,
                duration: nCompiler.endTimestamp - nCompiler.startTimestamp
            };
            nState.builds = {
                entries: {
                    ...nState.builds.entries,
                    [nCompiler.hash]: {
                        compiler: nCompiler.id,
                        hash: nCompiler.hash,
                        errors: [],
                        warnings: [],
                        emits: [],
                        startTimestamp: nCompiler.startTimestamp,
                        endTimestamp: nCompiler.endTimestamp,
                        duration: nCompiler.endTimestamp - nCompiler.startTimestamp
                    }
                },
                index: [
                    ...nState.builds.index,
                    nCompiler.hash
                ]
            };
        } else if (nCompiler.phase === 'dirty') {
            const [ warnings, errors, ...rest ] = (nCompiler as any);
            nState.compilers[nCompiler.id] = {
                ...rest,
                warnings: warnings.length,
                errors: errors.length,
                duration: nCompiler.endTimestamp - nCompiler.startTimestamp
            };
            nState.builds = {
                entries: {
                    ...nState.builds.entries,
                    [nCompiler.hash]: {
                        compiler: nCompiler.id,
                        hash: nCompiler.hash,
                        errors: errors,
                        warnings: warnings,
                        emits: [],
                        startTimestamp: nCompiler.startTimestamp,
                        endTimestamp: nCompiler.endTimestamp,
                        duration: nCompiler.endTimestamp - nCompiler.startTimestamp
                    }
                },
                index: [
                    ...nState.builds.index,
                    nCompiler.hash
                ]
            };
        } else if (nCompiler.phase === 'failed') {
            const endTimestamp = Date.now();
            const startTimestamp = (
                ((oCompiler && oCompiler.phase === 'invalid')
                    ? oCompiler.startTimestamp
                    : endTimestamp
                        /// TODO ::: consider merits of throwing fatally if compiler's previous phase
                        /// was not `invalid`. This would indicate a breakdown of the state machine. It
                        /// should only be possible to transition into `failed` from the `invalid` state
                )
            );
            nState.compilers[nCompiler.id] = {
                ...nCompiler,
                startTimestamp,
                endTimestamp,
                duration: endTimestamp - startTimestamp
            };
        }
        // count # of compilers that are not running / `phase` is not `invalid`
        nState.activeCompilers = (
            (Object.keys(nState.compilers)
                .filter(id => (
                   nState.compilers[id].phase === 'invalid'
                ))
                .length
            )
        );

        return nState;
    } else {
        return state;
    }
};

export default reducer;
