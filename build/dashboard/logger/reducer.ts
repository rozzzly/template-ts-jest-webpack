import * as shortID from 'shortid';

import { Reducer } from 'redux';
import State, { initialState, LogMessage }  from './state';
import { Actions, ActionIDs } from './actions';

export const reducer: Reducer<State, Actions> = (state = initialState, action) => {
    if (action.type === ActionIDs.ADD_LOG) {
        const id = shortID();
        const nMessage: LogMessage = {
            id,
            ...action.payload,
            timestamp: Date.now()
        };
        const nState = {
            entities: {
                ...state.entities,
                [id]: nMessage
            },
            index: {
                ...state.index,
                byTimestamp: [
                    ...state.index.byTimestamp,
                    id
                ]
            }
        };

        if (action.payload.channel) {
            if (action.payload.channel in nState.index.byChannel) {
                nState.index.byChannel[action.payload.channel] = [
                    ...nState.index.byChannel[action.payload.channel],
                    id
                ];
            } else {
                nState.index.byChannel[action.payload.channel] = [id];
            }
        }

        return nState;
    } else {
        return state;
    }
};

export default reducer;
