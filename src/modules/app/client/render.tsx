import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { App } from '../shared/App';


/// NOTE:: not a SFC so it can be called as a function from a `.ts` file
export const render = ():  React.ReactElement<{}> => (
    <BrowserRouter>
        <App />
    </BrowserRouter>
);


export default render;