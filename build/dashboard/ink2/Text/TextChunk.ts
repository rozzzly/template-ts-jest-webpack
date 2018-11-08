import * as stringWidth from 'string-width';
import { TextStyleOverride, ComputedTextStyle } from './TextStyle/TextStyle';

export class TextChunk {
    private _cells: string[];
    public style: ComputedTextStyle;
    public readonly text: string;
    public readonly width: number;
    public readonly override: TextStyleOverride;

    public constructor(text: string, style: TextStyleOverride) {
        this.text = text;
        this.width = stringWidth(text);
        this.override = style;
    }

    public computeStyle(precedingStyle: ComputedTextStyle): ComputedTextStyle {
        this.style = precedingStyle.override(this.style);
        return this.style;
    }

    public get cells(): string[] {
        if (!this._cells) {
            this._cells = Array.from(this.text); // handles emojis / multibyte unicode chars well
        }
        return this._cells;
    }

}
