import * as React from 'react';
import * as blessed from 'blessed';
import { render } from 'react-blessed';
import App from './App';



export default function() {
    const screen = blessed.screen({
        autoPadding: true,
        smartCSR: true,
        title: 'simmer dashboard'
    });
    screen.key(['escape', 'q', 'C-c'], (ch, key) => (
        process.exit(0)
    ));
    render(<App />, screen);
}
