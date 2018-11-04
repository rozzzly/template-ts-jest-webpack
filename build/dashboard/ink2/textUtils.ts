import * as strWidth from 'string-width';

const newlineRegex: RegExp = /\r?\n/g;
const ansiStyleRegex: RegExp = /(\u001b\[(?:\d+;)*\d+m)/u;

export class SplitText {

    public readonly raw: string;
    public readonly normalized: string;
    public readonly styled: boolean;
    public readonly lines: string[];
    public readonly lineWidths: number[];
    public readonly height: number;
    public readonly width: number;

    public constructor(str: string) {
        this.raw = str;
        this.normalized = str.normalize();
        this.styled = ansiStyleRegex.test(this.normalized);

        if (this.styled) {
            throw new Error('not supported yet');
        } else {
            this.lines = this.normalized.split(newlineRegex);
            let maxWidth: number = 0;
            this.lineWidths = this.lines.map(line => {
                const width = strWidth(line);
                if (width > this.width) {
                    maxWidth = width;
                }
                return width;
            });
            this.height = this.lines.length;
            this.width = maxWidth;
        }
    }
}
