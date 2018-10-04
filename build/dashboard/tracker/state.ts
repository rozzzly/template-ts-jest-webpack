import { CompilerState } from './CompilerPhase';

export const initialState: State = {
    idleCompilers: 0,
    compilers: {}
};

export interface State {
    idleCompilers: number;
    compilers: {
        [compilerID: string]: CompilerState;
    };
}

export default State;
