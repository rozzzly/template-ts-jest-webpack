import * as ink from 'ink';
import * as ansi from 'ansi-escapes';
import App from './App';
import CompilerTracker from '../CompilerTracker';


export default function(tracker: CompilerTracker<string>) {
    process.stdout.write(ansi.clearScreen);
    const unmount = ink.render(<App tracker={tracker} stdout={process.stdout} />, process.stdout);
}
