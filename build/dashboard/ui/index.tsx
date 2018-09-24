import * as React from 'react';
import * as blessed from 'blessed';
import { render } from 'react-blessed';
import App from './App';
import Tracker from '../Tracker';



export default function(tracker: Tracker<string>) {
    const screen = blessed.screen({
        autoPadding: true,
        smartCSR: true,
        title: 'simmer dashboard',
        fullUnicode: true
    });
    screen.key(['escape', 'q', 'C-c'], (ch, key) => (
        process.exit(0)
    ));
    render(<App tracker={tracker} />, screen);
}
