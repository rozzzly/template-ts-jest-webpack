import * as ink from 'ink';
import App from './App';
import Tracker from '../Tracker';


export default function(tracker: Tracker<string>) {
    const unmount = ink.render(<App tracker={tracker} stdout={process.stdout} />, process.stdout);
}
