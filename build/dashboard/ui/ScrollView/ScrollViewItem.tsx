import * as React from 'react';
import { Box, Color } from 'ink';

export interface ScrollViewItemProps<D extends any> {
    data: D;
    width: number;
    highlighted: boolean;
}



export abstract class ScrollViewItem<P extends ScrollViewItemProps<any>> {
    public id: string;
    public kind: string;
    public abstract height(props: P): number;
    public abstract renderLines(props: P): string[];
}

export interface ScrollViewItemWithHeaderData {
    timestamp: number;
    label: string;
}
export interface ScrollViewItemWithHeaderProps<D extends ScrollViewItemWithHeaderData> extends ScrollViewItemProps<D> { }

export abstract class ScrollViewItemWidthHeader<
    D extends ScrollViewItemWithHeaderData,
    P extends ScrollViewItemWithHeaderProps<D>
> extends ScrollViewItem<P> {
    public height(props: P): number {
        return this.bodyHeight(props) + 1;
    }
    public abstract bodyHeight(props: P): number;
    public abstract renderHeader(props: P): string;
    public abstract renderBodyLines(props: P): string[];
    public renderLines(props: P): string[] {
        return [
            this.renderHeader(props),
            ...this.renderBodyLines(props)
        ];
    }
}
