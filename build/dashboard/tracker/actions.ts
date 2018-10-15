import { Action } from 'redux';
import { CompilerStatePatch } from './state';


export namespace ActionIDs {
    export type UPDATE_COMPILER = typeof UPDATE_COMPILER;
    export const UPDATE_COMPILER: 'dashboard.tracker:UPDATE_COMPILER' = 'dashboard.tracker:UPDATE_COMPILER';
}

export type ActionIDs = (
    | ActionIDs.UPDATE_COMPILER
);

export namespace Actions {
    export interface UPDATE_COMPILER extends Action<ActionIDs.UPDATE_COMPILER> {
        payload: CompilerStatePatch;
    }
}

export type Actions = (
    | Actions.UPDATE_COMPILER
);

export const updateCompiler = (state: CompilerStatePatch): Actions.UPDATE_COMPILER => ({
    type: ActionIDs.UPDATE_COMPILER,
    payload: state
});
updateCompiler.actionID = ActionIDs.UPDATE_COMPILER;

export default {
    updateCompiler
};
