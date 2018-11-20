import * as stringWidth from 'string-width';

import TreeNode from './TreeNode';
import { LineCoords } from '../Renderer/Coords';
import Style from '../Text/Style';
import TextChunk from '../Text/TextChunk';
import { parseChunks } from '../Text/parse';

export class TextNode extends TreeNode<'TextNode'> {
    public kind: 'TextNode' = 'TextNode';
    private text: string;
    protected chunks: TextChunk[];

    public constructor(text: string) {
        super();
        this.setText(text);
    }

    public get textRaw(): string {
        // return this.text.raw;
        return this.text;
    }

    public setText(text: string): void {
        if (this.text !== text) {
            this.text = text;
            this.chunks = [];
            let width = 0;
            parseChunks(text.normalize()).forEach(chunk => {
                this.chunks.push(chunk);
                width += chunk.width;
            });
            this.yoga.setOptions({
                width: width,
                height: 1
            });
        }
    }

}
export default TextNode;
