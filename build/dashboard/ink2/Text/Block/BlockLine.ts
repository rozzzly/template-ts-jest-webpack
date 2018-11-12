import { Style } from '../Style';
import { TextChunk } from '../TextChunk';


export class BlockLine {

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

    public render(skip: number, width: number, parent: Style, preceding: Style): [Style, string] {
        const endX = width + skip;
        let cursor = skip;
        let code;
        let lastStyle = preceding;
        const buff: string[] = [];

        let lastChunkEnd = 0;
        for (const chunk of this.chunks) {
            const chunkStart = lastChunkEnd;
            const chunkEnd = chunkStart + chunk.width;
            lastChunkEnd = chunkEnd;
            if (cursor >= endX) break; // |++++++|L--R
            else if (cursor >= chunkEnd) continue; // L--R|++++++|
            else {
                if (cursor > chunkStart) { // L-|-R+++++| or L-|-------|-R
                    if (chunkEnd > endX) { // L-|-------|-R
                        const sliceStart = cursor - chunkStart;
                        const sliceEnd = chunk.width - (chunkEnd - endX);
                        [lastStyle, code] = Style.rollingCode(chunk.override, parent, lastStyle);
                        buff.push(code, chunk.cells.slice(sliceStart, sliceEnd).join(''));
                        break; // nothing else will be rendered
                    } else { // L-|-R+++++|
                        const sliceStart = cursor - chunkStart;
                        [lastStyle, code] = Style.rollingCode(chunk.override, parent, lastStyle);
                        buff.push(code, chunk.cells.slice(sliceStart).join(''));
                        cursor = chunkEnd;
                    }
                } else { // |L----R| or |L-----|-R
                    if (chunkEnd > endX) { // |L-----|-R
                        const sliceEnd = chunk.width - (chunkEnd - endX);
                        [lastStyle, code] = Style.rollingCode(chunk.override, parent, lastStyle);
                        buff.push(code, chunk.cells.slice(0, sliceEnd).join(''));
                        break;
                    } else { // |L----R|
                        [lastStyle, code] = Style.rollingCode(chunk.override, parent, lastStyle);
                        buff.push(code, chunk.text);
                        cursor = chunkEnd;
                    }
                }
            }
        }
        return [ lastStyle, buff.join('') ];
    }
}
export default BlockLine;
