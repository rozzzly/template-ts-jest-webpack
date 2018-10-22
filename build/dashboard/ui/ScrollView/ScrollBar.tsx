import * as React from 'react';
import Chalk from 'chalk';
import { Overwrite } from 'typelevel-ts';
import { Box, Color } from 'ink';

export interface ScrollBarProps {
    trackChar?: string;
    nubChar?: string;
    upChar?: string;
    downChar?: string;
    displayArrows?: boolean;
    nubHeight: number;
    nubOffset: number;
    trackHeight: number;
}

const defaultProps = {
    // upChar: '⌃',
    // upChar: '⏶',
    upChar: '⋀',
    // downChar: '⌄',
    // downChar: '⏷',
    downChar: '⋁',
    // trackChar: '░',
    trackChar: '│',
    nubChar: '█',
    displayArrows: true
};


export const ScrollBar: React.SFC<ScrollBarProps> = (_props) => {
    const props = { ...defaultProps, ..._props };

    const blocks = [];
    if (props.displayArrows) {
        blocks.push(
            Chalk.cyan(props.upChar)
        );
    }
    for (let i = 0; i < props.trackHeight - (props.displayArrows ? 2 : 0); i++) {
        if (i < props.nubOffset || i >= props.nubHeight + props.nubOffset) {
            blocks.push(
                Chalk.blue(props.trackChar)
            );
        } else {
            blocks.push(
                Chalk.cyan(props.nubChar)
            );
        }
    }
    if (props.displayArrows) {
        blocks.push(
            Chalk.cyan(props.downChar)
        );
    }

    return (
        <Box width={5}>
            { blocks.join('\n') }
        </Box>
    );
};

export default ScrollBar;
