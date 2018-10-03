import { CompilerState } from './CompilerPhase';

export const initialState: State = {
    compilers: {}
};

export interface State {
    compilers: {
        [compilerID: string]: CompilerState;
    };
}

export default State;
