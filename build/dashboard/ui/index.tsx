import * as React from 'react';
import * as ink from 'ink';
import * as ansi from 'ansi-escapes';

import { Provider } from 'react-redux';
import App from './App';
import CompilerTracker from '../CompilerTracker';
import store from '../store';
import { updateCompiler } from '../tracker/actions';


export default function(compilerIDs: string[]) {
    compilerIDs.forEach(id => {
        store.dispatch(updateCompiler({ id, phase: null }));
    });
    process.stdout.write(ansi.clearScreen);
    const unmount = ink.render((
        <Provider store={store}>
            <App stdout={process.stdout} />
        </Provider>
    ), process.stdout);
}
