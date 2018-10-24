
export interface State {
    width: number;
    height: number;
}

export const initialState = {
    width: process.stdout.columns || 80,
    height: process.stdout.rows || 10
};

export default State;
