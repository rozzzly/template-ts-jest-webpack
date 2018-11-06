import { normalize, parseChunks } from './parse';
import { TextChunk } from './TextChunk';

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
}


export class TextBlock {
    public static cache: Map<string, TextBlock> = new Map();

    public readonly raw: string;
    public readonly normalized: string;
    public readonly lines: TextBlockLine[];

    private constructor(raw: string) {
        this.raw = raw;
        this.lines = [new TextBlockLine()];
        this.normalized = normalize(raw);
        parseChunks(this.normalized).forEach(chunk => {
            if (chunk.isMultiLine) {
                const [head, ...rest] = chunk.splitLines();
                this.append(head);
                rest.forEach(line => this.lines.push(new TextBlockLine(line)));
            } else {
                this.append(chunk);
            }
        });

        TextBlock.cache.set(raw, this);
    }

    private append(chunk: TextChunk): void {
        this.lines[this.lines.length - 1].append(chunk);
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
