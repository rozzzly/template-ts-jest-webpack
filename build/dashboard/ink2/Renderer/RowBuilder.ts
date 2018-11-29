import * as stringWidth from 'string-width';
import Style from '../Text/Style';
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
    public gap(width: number, gapFiller: GapFiller = defaultGapFiller) {
        gapFiller(this, { x0: this.width, x1: this.width + width, y: this.y }, null);
    }
    public styledGap(width: number, style: Style, gapFiller: GapFiller = defaultGapFiller) {
        gapFiller(this, { x0: this.width, x1: this.width + width, y: this.y }, style);
    }
    public style(style: Style): this {
        this.buff.push(style.code(this.precedingStyle));
        this.precedingStyle = style;
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
    public styledText(style: Style, text: string): this;
    public styledText(style: Style, text: string, textWidth: number): this;
    public styledText(style: Style, text: string, textWidth: number | null = null): this {
        this.buff.push(style.code(this.precedingStyle), text);
        this.precedingStyle = style;
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
