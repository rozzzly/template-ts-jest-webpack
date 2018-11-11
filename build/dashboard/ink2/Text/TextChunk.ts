import * as stringWidth from 'string-width';
import { StyleOverride, Style } from './Style';

export class TextChunk {
    private _cells: string[];
    public style: Style;
    public readonly text: string;
    public readonly width: number;
    public readonly override: StyleOverride;

    public constructor(text: string, override: StyleOverride) {
        this.text = text;
        this.width = stringWidth(text);
        this.override = override;
    }

    public cascade(precedingStyle: Style): Style {
        this.style = precedingStyle.override(this.override);
        return this.style;
    }

    public get cells(): string[] {
        if (!this._cells) {
            this._cells = Array.from(this.text); // handles emojis / multibyte unicode chars well
        }
        return this._cells;
    }

}
