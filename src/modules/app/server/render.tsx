import * as React from 'react';
import { StaticRouter, StaticRouterProps } from 'react-router';
import { App } from '../shared/App';

/// NOTE:: not a SFC so it can be called as a function from a `.ts` file
export const render = ({ ...props }):  React.ReactElement<StaticRouterProps> => (
    <StaticRouter {...props}>
        <App />
    </StaticRouter>
);


export default render;