import * as React from 'react';
import * as cliSpinners from 'cli-spinners';
import { ColorProps } from 'ink';

export interface SpinnerProps {
    kind: cliSpinners.SpinnerKind;
}

const startTS = Date.now();

export const Spinner: React.SFC<SpinnerProps> = ({ kind: type }) => (
    <>
        {
            cliSpinners[type].frames[
                (Math.floor((Date.now() - startTS) / cliSpinners[type].interval) % cliSpinners[type].frames.length)
            ]
        }
    </>
);
