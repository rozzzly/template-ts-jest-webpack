import * as ink from 'ink';
import * as ansi from 'ansi-escapes';

import { Provider } from 'ink-redux';
import App from './App';
import CompilerTracker from '../CompilerTracker';
import store from '../store';


export default function(tracker: CompilerTracker<string>) {
    process.stdout.write(ansi.clearScreen);
    const unmount = ink.render((
        <Provider store={store}>
            <App tracker={tracker} stdout={process.stdout} />
        </Provider>
    ), process.stdout);
}
