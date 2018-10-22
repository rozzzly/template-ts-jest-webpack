import * as React from 'react';
import * as ink from 'ink';
import * as ansi from 'ansi-escapes';
import { Provider } from 'react-redux';

import App from './App';
import store from '../store';


export default function() {
    process.stdout.write(ansi.clearScreen);
    process.on('beforeExit', () => {
        process.stdout.write(ansi.clearScreen);
    });
    const checks = process.stdout;
    if (!checks.isTTY || !checks.rows || !checks.columns) {
        throw new ReferenceError('not sure how to handle this environment, sure its a TTY??');
    } else {
        const unmount = ink.render((
            <Provider store={store}>
                <App stdout={process.stdout} />
            </Provider>
        ), process.stdout);
    }
}
