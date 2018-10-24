import * as React from 'react';
import * as memoize from 'memoize-one';
import { connect } from 'react-redux';
import { Box, Color } from 'ink';
import ScrollBar from './ScrollBar';
import { LogItem, ScrollViewItem, DefaultScrollViewItem } from './ScrollViewItem';
import State from '../../State';



export interface ScrollViewState {
    offset: number;
}

export interface ScrollViewProps {
    rows: number;
    cols: number;
    items: ScrollViewItem<any>[];
}

export type Constructor<C> = { new (...args: any): C; };

const KindMap: {
    [kind: string]: Constructor<ScrollViewItem<any>>
} = {
    LogItem: LogItem,
    default: DefaultScrollViewItem
};


const ts = Date.now();

export type ListViewItemsWithHeight = {
    items: {
        item: ScrollViewItem<any>,
        height: number
    }[];
    totalHeight: number;
};

class ScrollView extends React.Component<ScrollViewProps> {

    private memoized: (items: ScrollViewItem<any>[], width: number) => ListViewItemsWithHeight = memoize(
        (items: ScrollViewItem<any>[], width: number): ListViewItemsWithHeight  => {
            const ret: ListViewItemsWithHeight = { totalHeight: 0, items: [] };
            items.forEach(item => {
                const height = item.height((ret.items.length === 1), width);
                ret.items.push({ item, height });
                ret.totalHeight += height;
            });
            return ret;
        }
    );

    public render() {
        const { cols, rows } = this.props;
        const width = cols;
        const height = rows - 5;
        const itemsWithHeight = this.memoized(this.props.items, width - 3);


        return (
            <Box flexDirection='row' width={width} height={height}>
                <Box flexGrow={1} flexDirection='column' marginLeft={0} height={height} width={width - 3} marginRight={1}>
                    { ...itemsWithHeight.items.map((entry, index) => (
                        entry.item.render(index === 1, width - 3, 0, 0)
                    ))}
                </Box>
                <ScrollBar trackHeight={height} nubHeight={4} nubOffset={3} />
            </Box>

        );
    }
}

const ConnectedScrollView = connect((state: State) => {
    const items: ScrollViewItem<any>[] = [];
    state.logger.index.byTimestamp.forEach(itemID => {
        const item = state.logger.entities[itemID];
        if (item.kind in KindMap) {
            const Kind = KindMap[item.kind];
            items.push(new Kind(item));
        } else {
            const Kind = KindMap['default'];
            items.push(new Kind(item));
        }
    });
    return {
        items
    };
})(ScrollView);

export {
    ConnectedScrollView as ScrollView,
    ConnectedScrollView as default
};
