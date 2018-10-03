import * as ink from 'ink';
import * as Spinner from 'ink-spinner';
import * as strWidth from 'string-width';
import Chalk from 'chalk';

import { lib as emoji } from 'emojilib';
import CompilerTracker from '../CompilerTracker';
import CompilerHandle, { CompilerState } from '../CompilerHandle';
import { Spacer, Line } from './Spacer';

export interface StatusBarItemProps {
    id: string;
    index: number;
    handleState: CompilerState;
}

export const StatusBarItem: ink.SFC<StatusBarItemProps> = ({ id, index,  handleState }) => {
    const label =  ` [ ${id} ] `;
    if (handleState.status === null) {
        return (
            <span>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <ink.Color bgHex='#999999' hex='#fefefe' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    inactive
                </ink.Color>
            </span>
        );
    } else if (handleState.status === 'clean') {
        return (
            <span>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <ink.Color bgGreen hex='#010101' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color green>clean</ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    { `(${handleState.duration}ms)` }
                </ink.Color>
            </span>
        );
    } else if (handleState.status === 'dirty') {
        return (
            <span>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <ink.Color bgRed hex='#010101' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color red>
                    { handleState.errors.length } errors / { handleState.warnings.length } warnings
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    { `(${handleState.duration}ms)` }
                </ink.Color>
            </span>
        );
    } else if (handleState.status === 'invalid') {
        return (
            <span>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <ink.Color bgBlue hex='#010101' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <Spinner blue />
                <Spacer count={1} character={' '} />
                <ink.Color blue>
                    building
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    { `(${handleState.duration}ms)` }
                </ink.Color>
            </span>
        );
    } else if (handleState.status === 'failed') {
        return (
            <span>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <ink.Color bgYellow hex='#010101' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color yellow>
                    fatal error
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    { `(${handleState.duration}ms)` }
                </ink.Color>
            </span>
        );
    } else {
        return (
            <span>
                wtf
            </span>
        );
    }
};
export interface StatusBarProps {
    tracker: CompilerTracker<string>;
}


const StatusBarInner: ink.SFC<StatusBarProps> = ({ tracker }) => {
    let index = 0;
    return (
        <span>
            {
                tracker.map((handle, id) => (
                    <StatusBarItem handleState={handle.state} id={id} index={index++} />
                ))
            }
            <Spacer count={1} character={' '} />
        </span>
    );
};

const boxEdges = {
    topLeft: '┌',
    topRight: '┐',
    bottomRight: '┘',
    bottomLeft: '└',
    vertical: '│',
    horizontal: '─'
};
Object.keys(boxEdges).forEach((key: keyof typeof boxEdges) => {
    boxEdges[key] = Chalk.hex('#999999')(boxEdges[key]);
});


export const StatusBar: ink.SFC<StatusBarProps> = ({ tracker }, { console }) => {
    const content = ink.renderToString(<StatusBarInner tracker={tracker} />);
    const width = strWidth(content);

    const filler = ' '.repeat(console.width - 2 - width);
    const top = boxEdges.topLeft + boxEdges.horizontal.repeat(console.width - 2) + boxEdges.topRight;
    const bottom = boxEdges.bottomLeft + boxEdges.horizontal.repeat(console.width - 2) + boxEdges.bottomRight;
    const middle = boxEdges.vertical + content + filler + boxEdges.vertical;


    return (
        <span>
             { [top, middle, bottom].join('\n') }
        </span>
    );
};

export default StatusBar;
