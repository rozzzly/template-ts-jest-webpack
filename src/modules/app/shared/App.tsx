import * as React from 'react';
import { Switch, Route } from 'react-router';

import routes from './routes';

export const MOUNT_POINT_ID: string = '$APP_MOUNT_POINT$';

export const App: React.SFC = ({}) => (
    <div id='appContainer'>
        <Switch>{routes.map((route, index) => <Route key={index} {...route} />)}</Switch>
    </div>
);

