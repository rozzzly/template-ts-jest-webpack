import * as stringWidth from 'string-width';
import { TextStyle, OwnStyle } from './TextStyle/TextStyle';
import { normalize, parseChunks } from './parse';

export const newlineRegex: RegExp = /\r?\n/g;
export class TextChunk {
    private _cells: string[];
    public readonly text: string;
    public readonly style: OwnStyle;
    public readonly width: number;

    public constructor(text: string, style: OwnStyle) {
        this.text = text;
        this.width = stringWidth(text);
        this.style = style;
    }

    public get cells(): string[] {
        if (!this._cells) {
            this._cells = Array.from(this.text); // handles emojis / multibyte unicode chars well
        }
        return this._cells;
    }

    public get isMultiLine(): boolean {
        return newlineRegex.test(this.text);
    }
    public splitLines(): TextChunk[] {
        const split = this.text.split(newlineRegex);
        return split.map(piece => new TextChunk(piece, this.style));
    }

    public computeStyle
    public render(parentStyle: TextStyle, precedingSiblingStyle:  TextStyle = {}): string {

    }
}
