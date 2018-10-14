import { Color, Box } from 'ink';
import { connect } from 'react-redux';
import * as React from 'react';
import { lib as emoji } from 'emojilib';

import { Spacer, Line } from './Spacer';
import { CompilerState, CompilerStateMap } from '../tracker/state';
import { State } from '../state';

export interface StatusBarItemProps {
    id: string;
    index: number;
    compiler: CompilerState;
}

export const StatusBarItem: React.SFC<StatusBarItemProps> = ({ id, index,  compiler }) => {
    const label =  ` [ ${id} ] `;
    if (compiler.phase === null) {
        return (
            <Box>
                { index === 0 ? '  ' : ' ' }
                <Color bgHex='#999999' hex='#fefefe' bold>
                    { label }
                </Color>
                { ' ' }
                <Color hex='#999999'>
                    inactive
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'clean') {
        return (
            <Box>
                { index === 0 ? '  ' : ' ' }
                <Color bgGreen hex='#010101' bold>
                    { label }
                </Color>
                {' '}
                <Color green>clean</Color>
                {' '}
                <Color hex='#999999'>
                    { `(${compiler.duration}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'dirty') {
        return (
            <Box>
                { index === 0 ? '  ' : ' ' }
                <Color bgRed hex='#010101' bold>
                    { label }
                </Color>
                { ' ' }
                <Color red>
                    { `${compiler.errors.length} errors / ${compiler.warnings.length} warnings`}
                </Color>
                { ' ' }
                <Color hex='#999999'>
                    { `(${compiler.duration}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'invalid') {
        return (
            <Box>
                { index === 0 ? '  ' : ' ' }
                <Color bgBlue hex='#010101' bold>
                    { label }
                </Color>
                { ' ' }
                <Color blue>
                    building
                </Color>
                { ' ' }
                <Color hex='#999999'>
                    { `(${Date.now() - compiler.startTimestamp}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'failed') {
        return (
            <Box>
                { index === 0 ? '  ' : ' ' }
                <Color bgYellow hex='#010101' bold>
                    { label }
                </Color>
                { ' ' }
                <Color yellow>
                    fatal error
                </Color>
                { ' ' }
                <Color hex='#999999'>
                    { `(${compiler.duration}ms)` }
                </Color>
            </Box>
        );
    } else {
        return (
            <>
                wtf
            </>
        );
    }
};

// const boxEdges = {
//     topLeft: '┌',
//     topRight: '┐',
//     bottomRight: '┘',
//     bottomLeft: '└',
//     vertical: '│',
//     horizontal: '─'
// };
// Object.keys(boxEdges).forEach((key: keyof typeof boxEdges) => {
    //     boxEdges[key] = Chalk.hex('#999999')(boxEdges[key]);
// });

export interface StatusBarProps {
    compilers: Record<string, CompilerState>;
}

const _StatusBar: React.SFC<StatusBarProps> = ({ compilers }) => (
    <Box flexDirection='row'>
        {
            ...Object.keys(compilers).map((id, index) => (
                <StatusBarItem compiler={compilers[id]} id={id} key={index} index={index} />
            ))
        }
    </Box>
);

export const StatusBar = connect((state: State) => ({
    compilers: state.tracker.compilers
}))(_StatusBar);

export default StatusBar;
