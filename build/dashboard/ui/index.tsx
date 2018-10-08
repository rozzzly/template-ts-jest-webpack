import * as React from 'react';
import * as ink from 'ink';
import * as ansi from 'ansi-escapes';
import { inspect } from 'util';
import { Provider } from 'react-redux';
import App from './App';
import store from '../store';
import { updateCompiler } from '../tracker/actions';


export default function() {
    process.stdout.write(ansi.clearScreen);
    // store.subscribe(() => {
    //     console.log(inspect(store.getState(), {colors: true, depth: 8, showHidden: true}));
    // });
     const unmount = ink.render((
         <Provider store={store}>
             <App stdout={process.stdout} />
        </Provider>
    ), process.stdout);
}
