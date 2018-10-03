import { combineReducers, Reducer } from 'redux';

import { State } from './State';
import { Actions } from './Actions';
import LoggerReducer from './logger/reducer';
import TrackerReducer from './tracker/reducer';

export const getRootReducer = (): Reducer<State, Actions> => combineReducers({
    logger: LoggerReducer,
    tracker: TrackerReducer
});


export default getRootReducer;
