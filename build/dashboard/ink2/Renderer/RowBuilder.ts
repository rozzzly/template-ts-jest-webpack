import * as stringWidth from 'string-width';
import Style, { StyleOverride } from '../Text/Style';
import GapFiller, { defaultGapFiller } from './GapFiller';

export class RowBuilder {
    private precedingStyle: Style;
    private buff: string[];
    private width: number;
    private y: number;
    public constructor(y: number) {
        this.precedingStyle = Style.base;
        this.width = 0;
        this.buff = [];
        this.y = y;
    }
    public gap(width: number, gapFiller: GapFiller = defaultGapFiller): this {
        /// TODO ::: consider the following
        // return result of gapFiller (which should === this) instead of returning this directly to ensure
        // chained calls are consecutive.. not sure this is strictly speaking necessary...
        return gapFiller(this, { x0: this.width, x1: this.width + width, y: this.y }, null) as this;
    }
    public styledGap(style: Style | StyleOverride, width: number, gapFiller: GapFiller = defaultGapFiller): this {
        const _style = Style.isStyle(style) ? style : new Style(style);
        return gapFiller(this, { x0: this.width, x1: this.width + width, y: this.y }, _style) as this;
    }
    public style(style: Style | StyleOverride): this {
        const _style = Style.isStyle(style) ? style : new Style(style);
        this.buff.push(_style.code(this.precedingStyle));
        this.precedingStyle = _style;
        return this;
    }
    public text(text: string): this;
    public text(text: string, textWidth: number): this;
    public text(text: string, textWidth: number | null = null): this {
        this.buff.push(text);
        this.width += ((textWidth !== null)
            ? textWidth
            : stringWidth(text));
        return this;
    }
    public styledText(style: Style | StyleOverride, text: string): this;
    public styledText(style: Style | StyleOverride, text: string, textWidth: number): this;
    public styledText(style: Style | StyleOverride, text: string, textWidth: number | null = null): this {
        const _style = Style.isStyle(style) ? style : new Style(style);
        this.buff.push(_style.code(this.precedingStyle), text);
        this.precedingStyle = _style;
        this.width += ((textWidth !== null)
            ? textWidth
            : stringWidth(text));
        return this;
    }
    public toString(): string {
        this.buff.push(Style.resetCode, '\r\n');
        return this.buff.join('');
    }
}
export default RowBuilder;
