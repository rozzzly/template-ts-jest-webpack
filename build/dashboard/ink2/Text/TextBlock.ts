import { normalize, parseChunks } from './parse';
import { TextChunk } from './TextChunk';
import { literalsEnum, ExtractLiterals } from '../misc';
import { ComputedTextStyle, baseStyle } from './TextStyle/TextStyle';

export const newlineRegex: RegExp = /\r?\n/g;

export class TextBlockLine {
    public width: number;

    public readonly chunks: TextChunk[];

    public constructor()
    public constructor(chunk: TextChunk);
    public constructor(chunk: TextChunk | null = null) {
        if (chunk) {
            this.chunks = [ chunk ];
            this.width = chunk.width;
        } else {
            this.chunks = [];
            this.width = 0;
        }
    }

    public append(chunk: TextChunk): void {
        this.chunks.push(chunk);
        this.width += chunk.width;
    }

    public computeStyle(base: ComputedTextStyle) {
        let rollingStyle = base;
        for (const chunk of this.chunks) {
            rollingStyle = chunk.computeStyle(rollingStyle);
        }
        return rollingStyle;
    }

    public render(xOffset: number, blockWidth: number, precedingStyle: ComputedTextStyle): { lastStyle: ComputedTextStyle, text: string } {
        let lastStyle = precedingStyle;
        let cursor = xOffset;
        const buff: string[] = [];


        if (xOffset >= blockWidth) {
            return { lastStyle, text: '' };
        } else if (this.width - xOffset <= 0) {
            return { lastStyle, text: '' };
        } else {
            for (const chunk of this.chunks) {
                if (cursor >= blockWidth) break; // |++++++|L--R
                else if (cursor + chunk.width <= 0) { // L--R|++++++|
                    cursor += chunk.width;
                } else {
                    if (cursor < 0) { // L-|-R+++++| or L-|-------|-R
                        if (cursor + chunk.width > blockWidth) { // L-|-------|-R
                            const start = 0 - cursor;
                            const end = blockWidth - (cursor + chunk.width);
                            buff.push(chunk.style.code(lastStyle));
                            buff.push(chunk.cells.slice(start, end).join(''));
                            lastStyle = chunk.style;
                            cursor += end - start;
                        } else { // L-|-R+++++|
                            const start = 0 - cursor;
                            buff.push(chunk.style.code(lastStyle));
                            buff.push(chunk.cells.slice(start, -1).join(''));
                            lastStyle = chunk.style;
                            cursor += chunk.width - start;
                        }

                    } else { // |L----R| or |L-----|-R
                        if (cursor + chunk.width > blockWidth) { // |L-----|-R
                            const size = blockWidth - cursor;
                            buff.push(chunk.style.code(lastStyle));
                            buff.push(chunk.cells.slice(0, size).join(''));
                            lastStyle = chunk.style;
                            cursor += size;
                        } else { // |L----R|
                            buff.push(chunk.style.code(lastStyle));
                            buff.push(chunk.text);
                            lastStyle = chunk.style;
                            cursor += chunk.width;
                        }
                    }
                }
            }
            return { lastStyle, text: buff.join('') };
        }
    }
}

export const TextAlign = literalsEnum(
    'left',
    'center',
    'right'
);
export type TextAlign = ExtractLiterals<typeof TextAlign>;


export class TextBlock {
    public static cache: Map<string, TextBlock> = new Map();

    public readonly raw: string;
    public readonly normalized: string;
    public readonly lines: TextBlockLine[];
    public parentStyle: ComputedTextStyle | null;

    private eolReached: boolean;

    private constructor(raw: string) {
        this.raw = raw;
        this.lines = [];
        this.eolReached = true;
        this.normalized = normalize(raw);
        parseChunks(this.normalized).forEach(chunk => {
            if (newlineRegex.test(chunk.text)) {
                const subChunks = chunk.text.split(newlineRegex).forEach(subChunkText => {
                    if (subChunkText === '') {
                        this.eolHit();
                    } else {
                        this.appendChunk(new TextChunk(subChunkText, chunk.override));
                    }
                });
            } else {
                this.appendChunk(chunk);
            }
        });

        TextBlock.cache.set(raw, this);
    }

    public computeStyles(base: ComputedTextStyle): void {
        if (this.parentStyle && !this.parentStyle.equalTo(baseStyle)) {
            this.parentStyle = base;
            let rollingStyle = base;
            for (const line of this.lines) {
                rollingStyle = line.computeStyle(rollingStyle);
            }
        }
    }

    private eolHit(): void {
        if (this.eolReached) {
            this.addLine();
        } else {
            this.eolReached = true;
        }
    }

    private addLine(): void {
        this.lines.push(new TextBlockLine());
    }

    private appendChunk(chunk: TextChunk): void {
        if (this.eolReached) this.addLine();
        this.lines[this.lines.length - 1].append(chunk);
        this.eolReached = false;
    }

    public static fromRaw(str: string): TextBlock {
        if (this.cache.has(str)) {
            return this.cache.get(str)!;
        } else {
            return new TextBlock(str);
        }
    }
}

/// TODO ::: find a better (real) LRU cache eviction mechanism
setInterval(() => TextBlock.cache.clear(), 1000 * 60 * 3);
