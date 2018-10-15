import * as React from 'react';

export const Line: React.SFC = ({}, { console }) => (
    <Spacer character={'─'} count={console.width} />
);

export interface SpacerProps {
    count: number;
    character: string;
}

export const Spacer: React.SFC<SpacerProps> = ({ character, count }) => {
    return <> {character.repeat(count)} </>;
};
Spacer.defaultProps = {
    character: ' ',
    count: 1
};
