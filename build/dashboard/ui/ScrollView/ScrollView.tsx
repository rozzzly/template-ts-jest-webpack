import * as React from 'react';
import { Box, Color } from 'ink';
import ScrollBar from './ScrollBar';



export interface ScrollViewState {

}

export interface ScrollViewProps {
    rows: number;
    cols: number;
}



class ScrollView extends React.Component<ScrollViewProps> {

    public render() {
        const { cols, rows } = this.props;
        const width = cols;
        const height = rows - 5;

        const lines = [
            <Box key={-2}>{ 'foo' }</Box>,
            <Color key={-1} red>{ 'red' }</Color>
        ];
        for (let i = 0; i < height - lines.length; i++) {
            lines.push(<Box key={i}>{`--${i}`}</Box>);
        }

        return (
            <Box flexDirection='row' width={width} height={height}>
                <Box flexGrow={1} flexDirection='column' marginLeft={0} height={height} width={width - 2}>
                    { ...lines }
                </Box>
                <ScrollBar trackHeight={height} nubHeight={4} nubOffset={3} />
            </Box>

        );
    }
}

export {
    ScrollView as ScrollView,
    ScrollView as default
};
