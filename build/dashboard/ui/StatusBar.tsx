import { Color, Box } from 'ink';
import { connect } from 'react-redux';
import * as React from 'react';
import Chalk from 'chalk';
import { lib as emoji } from 'emojilib';

import { CompilerState, CompilerStateMap } from '../tracker/state';
import { State } from '../state';
import { Spinner } from './Spinner';

export interface StatusBarItemProps {
    id: string;
    compiler: CompilerState;
}

export const StatusBarItem: React.SFC<StatusBarItemProps> = ({ id, compiler }) => {
    const label =  ` [ ${id} ] `;
    if (compiler.phase === null) {
        return (
            <Box marginLeft={1}>
                <Color bgHex='#999999' hex='#010101' bold>
                    { label }
                </Color>
                <Color hex='#999999'>
                    { ' inactive' }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'clean') {
        return (
            <Box marginLeft={1}>
                <Color bgGreen hex='#010101' bold>
                    { label }
                </Color>
                <Color green>
                    { ' clean' }
                </Color>
                <Color hex='#999999'>
                    { ` (${compiler.duration}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'dirty') {
        return (
            <Box marginLeft={1}>
                <Color bgRed hex='#010101' bold>
                    { label }
                </Color>
                <Color red>
                    { ` ${compiler.errors} errors / ${compiler.warnings} warnings`}
                </Color>
                <Color hex='#999999'>
                    { ` (${compiler.duration}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'invalid') {
        return (
            <Box marginLeft={1}>
                <Color bgBlue hex='#010101' bold>
                    { label }
                </Color>
                <Color blue>
                    { ' building ' }
                    <Spinner kind='arc' />
                </Color>
                <Color hex='#999999'>
                    { ` (${Date.now() - compiler.startTimestamp}ms)` }
                </Color>
            </Box>
        );
    } else if (compiler.phase === 'failed') {
        return (
            <Box marginLeft={1}>
                <Color bgYellow hex='#010101' bold>
                    { label }
                </Color>
                <Color yellow>
                    { ' fatal error' }
                </Color>
                <Color hex='#999999'>
                    { ` (${compiler.duration}ms)` }
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

const boxEdges = {
    topLeft: '┌',
    topRight: '┐',
    bottomRight: '┘',
    bottomLeft: '└',
    vertical: '│',
    horizontal: '─'
};
Object.keys(boxEdges).forEach((key: keyof typeof boxEdges) => {
    boxEdges[key] = Chalk.blue(boxEdges[key]);
});


export interface StatusBarProps {
    bordered: boolean;
    width?: number;
    compilers: Record<string, CompilerState>;
}

const StatusBar: React.SFC<StatusBarProps> = ({ bordered = true, width, compilers }) => {
    if (bordered && width) {
        return (
            <Box flexDirection='column'>
                { `${boxEdges.topLeft}${boxEdges.horizontal.repeat(width - 2)}${boxEdges.topRight}` }
                <Box flexDirection='row'>
                    { boxEdges.vertical }
                    <Box flexGrow={1}>
                        {
                            ...Object.keys(compilers).map((id, index) => (
                                <StatusBarItem compiler={compilers[id]} id={id} key={index} />
                            ))
                        }
                    </Box>
                    { boxEdges.vertical }
                </Box>
                { `${boxEdges.bottomLeft}${boxEdges.horizontal.repeat(width - 2)}${boxEdges.bottomRight}` }
            </Box>
        );
    } else {
        return (
            <Box flexDirection='row'>
                {
                    ...Object.keys(compilers).map((id, index) => (
                        <StatusBarItem compiler={compilers[id]} id={id} key={index} />
                    ))
                }
            </Box>
        );
    }
};

export const ConnectedStatusBar = connect((state: State) => ({
    compilers: state.tracker.compilers
}), null, null, { pure : false })(StatusBar);

export {
    ConnectedStatusBar as StatusBar,
    ConnectedStatusBar as default
};
