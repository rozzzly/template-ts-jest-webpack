import * as React from 'react';

export const Line: React.SFC = ({}, { console }) => (
    <Spacer character={'─'} count={console.width} />
);

export interface SpacerProps {
    count: number;
    character: string;
}

export const Spacer: React.SFC<SpacerProps> = ({ character, count }) => {
    return (
        <span>
            { character.repeat(count) }
        </span>
    );
};
Spacer.defaultProps = {
    character: ' ',
    count: 1
};
