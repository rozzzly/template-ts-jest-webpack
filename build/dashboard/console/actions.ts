import { Action } from 'redux';
import State from './state';

export namespace ActionIDs {
    export type RESIZE = typeof ActionIDs.RESIZE;
    export const RESIZE: 'dashboard.console:RESIZE' = 'dashboard.console:RESIZE';
}

export type ActionIDs = (
    | ActionIDs.RESIZE
);

export namespace Actions {
    export interface ADD_LOG extends Action<ActionIDs.RESIZE> {
        payload: State;
    }
}

export type Actions = (
    | Actions.ADD_LOG
);


export const resize = (payload: State): Actions.ADD_LOG => ({
    type: ActionIDs.RESIZE,
    payload
});
resize.actionID = ActionIDs.RESIZE;

export default {
    resize
};
