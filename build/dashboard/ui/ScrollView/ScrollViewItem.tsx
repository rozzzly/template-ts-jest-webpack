import * as React from 'react';
import * as wrapAnsi from 'wrap-ansi';
import * as stringWidth from 'string-width';
import Chalk from 'chalk';
import { Box, Color } from 'ink';
import { string } from 'prop-types';

export interface ScrollViewItemProps {
    id: string;
    kind: string;
}

export abstract class ScrollViewItem<P extends ScrollViewItemProps> {
    public highlight: string = Chalk.blue('> ');
    public props: P;

    public constructor(props: P) {
        this.props = props;
    }

    public abstract height(highlighted: boolean, width: number): number;
    public abstract renderLines(highlighted: boolean, width: number): string[];
    protected wrapAndPad(highlighted: boolean, width: number, str: string): string[] {
        const highlightedWidth = (highlighted) ? width - stringWidth(this.highlight) : width;
        const line = ((highlighted) ? this.highlight : '') + str;
        const usedWidth = stringWidth(line);
        if (usedWidth < highlightedWidth) {
            return [
                line + ' '.repeat(width - usedWidth)
            ];
        } else if (usedWidth > width) {
            let lines = wrapAnsi(str, highlightedWidth, { hard: true }).split('\n');
            lines = lines.reduce((reduction, ln) => (
                [...reduction, ...this.wrapAndPad(highlighted, width, ln)]
            ), []);
            if (highlighted) {
                lines = lines.map(ln => this.highlight + ln);
            }
            return lines;
        } else {
            return [ line ];
        }
    }
    public renderItem(highlighted: boolean, width: number, omitTop: number, omitBottom: number): string {
        const height = this.height(highlighted, width);
        const rawLines = this.renderLines(highlighted, width - (highlighted ? 2 : 0));
        const lines = rawLines.slice(omitTop, height - omitBottom);
        const str = lines.map(line => this.wrapAndPad(highlighted, width, line)).join('\n');
        return str;
    }
    public render(highlighted: boolean, width: number, omitTop: number, omitBottom: number) {

        return (
            <Box key={this.props.id}>
                {
                    this.renderItem(highlighted, width, omitTop, omitBottom)
                }
            </Box>
        );
    }
}

export class DefaultScrollViewItem extends ScrollViewItem<ScrollViewItemProps> {
    public height(highlighted: boolean, width: number): number {
        return this.renderLines(highlighted, width).length;
    }
    public renderLines(highlighted: boolean, width: number): string[] {
        const message = Chalk.yellow('No ScrollViewItem renderer found for kind `'  + this.props.kind + '`');
        const offset = Math.floor((width - stringWidth(message)) / 2);
        const padding = ' '.repeat(offset);
        return [
            padding + message
        ];
    }

}

export interface ScrollViewItemWithHeaderProps extends ScrollViewItemProps {
    timestamp: number;
    label?: string;
}

export abstract class ScrollViewItemWithHeader<
    P extends ScrollViewItemWithHeaderProps
> extends ScrollViewItem<P> {
    public height(highlighted: boolean, width: number): number {
        return this.bodyHeight(highlighted, width) + 1;
    }
    public abstract bodyHeight(highlighted: boolean, width: number): number;
    public abstract renderHeader(highlighted: boolean, width: number): string;
    public abstract renderBodyLines(highlighted: boolean, width: number): string[];

    public renderLines(highlighted: boolean, width: number): string[] {
        return [
            this.renderHeader(highlighted, width),
            ...this.renderBodyLines(highlighted, width)
        ];
    }
}

export interface LogItemProps extends ScrollViewItemWithHeaderProps {
    message: string;
}
export class LogItem extends ScrollViewItemWithHeader<LogItemProps> {
    public bodyHeight(highlighted: boolean, width: number): number {
        return this.renderBodyLines(highlighted, width).length;
    }
    public renderHeader(highlighted: boolean, width: number): string {
        const timestamp = (new Date(this.props.timestamp)).toUTCString();
        let label = '';
        switch (this.props.label && this.props.label.toLocaleLowerCase()) {
            case 'info':
            case 'information':
                label = Chalk.blue(this.props.label as string);
                break;
            case 'error':
            case 'fail':
            case 'failure':
                label = Chalk.red(this.props.label as string);
                break;
            case 'warn':
            case 'warning':
                label = Chalk.yellow(this.props.label as string);
                break;
            default:
                label = this.props.label || '';
                break;
        }
        let used = (highlighted) ? this.highlight : '';
        used += Chalk.grey(`─── [${timestamp}] `);
        if (label) {
            used += `${label} `;
        }
        const usedWidth = stringWidth(used);
        if (usedWidth < width) {
            return (used + Chalk.gray('─'.repeat(width - usedWidth)));
        } else {
            return wrapAnsi(used, width, { hard: true }).split('\n')[0];
        }

    }
    public renderBodyLines(highlighted: boolean, width: number): string[] {
        return this.wrapAndPad(highlighted, width, this.props.message);
    }


}
