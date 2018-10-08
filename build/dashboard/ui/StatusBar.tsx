import { Color, Box } from 'ink';
import * as React from 'react';

import { lib as emoji } from 'emojilib';
import { Spacer, Line } from './Spacer';
import { CompilerState, CompilerStateMap } from '../tracker/state';
import { State } from '../state';
import { connect } from 'react-redux';

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
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <Color bgHex='#999999' hex='#fefefe' bold>
                    { label }
                </Color>
                <Spacer count={1} character={' '} />
                <Color hex='#999999'>
                    inactive
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'clean') {
        return (
            <Box alignItems='flex-start' flexDirection='column'>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <Color bgGreen hex='#010101' bold>
                    { label }
                </Color>
                <Spacer count={1} character={' '} />
                <Color green>clean</Color>
                <Spacer count={1} character={' '} />
                <Color hex='#999999'>
                    { `(${compiler.duration}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'dirty') {
        return (
            <Box alignItems='flex-start' flexDirection='column'>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <Color bgRed hex='#010101' bold>
                    { label }
                </Color>
                <Spacer count={1} character={' '} />
                <Color red>
                    { compiler.errors.length } errors / { compiler.warnings.length } warnings
                </Color>
                <Spacer count={1} character={' '} />
                <Color hex='#999999'>
                    { `(${compiler.duration}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'invalid') {
        return (
            <Box alignItems='flex-start' flexDirection='column'>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <Color bgBlue hex='#010101' bold>
                    { label }
                </Color>
                <Spacer count={1} character={' '} />
                <Color blue>
                    building
                </Color>
                <Spacer count={1} character={' '} />
                <Color hex='#999999'>
                    { `(${Date.now() - compiler.startTimestamp}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'failed') {
        return (
            <Box alignItems='flex-start' flexDirection='column'>
                <Spacer count={ index ? 2 : 1 } character={' '} />
                <Color bgYellow hex='#010101' bold>
                    { label }
                </Color>
                <Spacer count={1} character={' '} />
                <Color yellow>
                    fatal error
                </Color>
                <Spacer count={1} character={' '} />
                <Color hex='#999999'>
                    { `(${compiler.duration}ms)` }
                </Color>
            </Box>
        );
    } else {
        return (
            <Box alignItems='flex-start' flexDirection='column'>
                wtf
            </Box>
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
    compilers: CompilerStateMap;
}

const _StatusBar: React.SFC<StatusBarProps> = ({ compilers }) => {
    // const content = ink.renderToString(<StatusBarInner tracker={tracker} />);


    return (
        <Box>
            {
                Object.keys(compilers).map((id, index) => (
                    <StatusBarItem compiler={compilers[id]} id={id} key={id} index={index} />
                ))
            }
        </Box>
    );
};

export const StatusBar = connect((state: State) => ({
    compilers: state.tracker.compilers
}))(_StatusBar);

export default StatusBar;
