import { TreeNode } from './TreeNode';
import { NodeKind } from '../Tree';
import * as stringWidth from 'string-width';

export class TextNode extends TreeNode<'TextNode'> {
    public kind: 'TextNode' = 'TextNode';
    private text: string;

    public get textRaw(): string {
        // return this.text.raw;
        return '';
    }

    public setText(text: string): void {
        if (this.text !== text) {
            this.text = text;
            const width = stringWidth(text);
            this.yoga.setOptions({
                width: width,
                height: 1
            });
        }
        // if (this.text && this.text.raw !== text) {
        //     this.text = new SplitText(text);
        //     this.setYogaOptions({
        //         height: this.text.height,
        //         width: this.text.width
        //     });
        // }
    }
}
