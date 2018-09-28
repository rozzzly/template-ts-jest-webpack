import * as ink from 'ink';

export const Line: ink.SFC = ({}, { console }) => (
    <Spacer character={'─'} count={console.width} />
);

export interface SpacerProps {
    count: number;
    character: string | ink.VNode;
}

export const Spacer: ink.SFC<SpacerProps> = ({ character, count }) => {
    if (typeof character === 'string') {
        return (
            <span>
                { character.repeat(count) }
            </span>
        );
    } else {
        return (
            <span>
                { ([] as ink.VNode[]).fill(character, 0, count) }
            </span>
        );
    }
};
Spacer.defaultProps = {
    character: ' ',
    count: 1
};
