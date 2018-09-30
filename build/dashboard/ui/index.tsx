import * as ink from 'ink';
import * as ansi from 'ansi-escapes';
import App from './App';
import Tracker from '../Tracker';


export default function(tracker: Tracker<string>) {
    process.stdout.write(ansi.clearScreen);
    const unmount = ink.render(<App tracker={tracker} stdout={process.stdout} />, process.stdout);
}
