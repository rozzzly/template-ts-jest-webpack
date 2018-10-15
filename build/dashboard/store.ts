import { createStore, Store as ReduxStore } from 'redux';
import getRootReducer from './rootReducer';
import { State } from './state';
import { Actions } from './Actions';

export type Store = ReduxStore<State, Actions>;
export const store: Store = createStore(getRootReducer());

export default store;
