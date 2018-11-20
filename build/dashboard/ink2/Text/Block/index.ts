import { normalize, parseChunks } from '../parse';
import TextChunk from '../TextChunk';
import BlockLine from './BlockLine';

export const newlineRegex: RegExp = /\r?\n/g;

export class Block {
    public static cache: Map<string, Block> = new Map();

    public readonly width: number;
    public readonly height: number;

    public readonly raw: string;
    public readonly normalized: string;
    public readonly lines: BlockLine[];

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

        Block.cache.set(raw, this);
    }

    private eolHit(): void {
        if (this.eolReached) {
            this.addLine();
        } else {
            this.eolReached = true;
        }
    }

    private addLine(): void {
        this.lines.push(new BlockLine());
    }

    private appendChunk(chunk: TextChunk): void {
        if (this.eolReached) this.addLine();
        this.lines[this.lines.length - 1].append(chunk);
        this.eolReached = false;
    }

    public static fromRaw(str: string): Block {
        if (this.cache.has(str)) {
            return this.cache.get(str)!;
        } else {
            return new Block(str);
        }
    }
}
export default Block;
/// TODO ::: find a better (real) LRU cache eviction mechanism
setInterval(() => Block.cache.clear(), 1000 * 60 * 3);
