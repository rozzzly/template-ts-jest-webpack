import State from './state';
import { Actions, ActionIDs } from './actions';
import { Reducer } from 'redux';
import { initialState } from './state';

export const reducer: Reducer<State, Actions> = (state = initialState, action) => {
    if (action.type === ActionIDs.UPDATE_COMPILER) {
        return state;
    } else {
        return state;
    }
};

export default reducer;
