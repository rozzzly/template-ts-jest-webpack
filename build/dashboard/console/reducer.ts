import State, { initialState } from './state';
import { Actions, ActionIDs } from './actions';
import { Reducer } from 'redux';


export const reducer: Reducer<State, Actions> = (state = initialState, action) => {
    if (action.type === ActionIDs.RESIZE) {
        return {
            ...action.payload
        };
    } else {
        return state;
    }
};

export default reducer;
