import { createStore } from 'redux';
import getRootReducer from './rootReducer';

export const store = createStore(getRootReducer());
export default store;
