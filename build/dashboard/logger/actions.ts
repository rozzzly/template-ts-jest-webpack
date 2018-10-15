import { Action } from 'redux';
import { IncomingLogMessage } from './state';


export namespace ActionIDs {
    export type ADD_LOG = typeof ActionIDs.ADD_LOG;
    export const ADD_LOG: 'dashboard.logger:ADD_LOG' = 'dashboard.logger:ADD_LOG';
}

export type ActionIDs = (
    | ActionIDs.ADD_LOG
);

export namespace Actions {
    export interface ADD_LOG extends Action<ActionIDs.ADD_LOG> {
        payload: IncomingLogMessage;
    }
}

export type Actions = (
    | Actions.ADD_LOG
);


export const addLog = (payload: IncomingLogMessage): Actions.ADD_LOG => ({
    type: ActionIDs.ADD_LOG,
    payload
});
addLog.actionID = ActionIDs.ADD_LOG;

export default {
    addLog
};
