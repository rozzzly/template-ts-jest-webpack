import { h, render } from 'ink';
import App from './App';
import Tracker from '../Tracker';



export default function(tracker: Tracker<string>) {
    const unmount = render(<App tracker={tracker} time={Date.now()}/>)
}
