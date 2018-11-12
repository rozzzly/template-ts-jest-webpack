import { BaseNode } from './BaseNode';
import { NodeKind } from '.';

export class TextNode extends BaseNode<'TextNode'> {
    public kind: 'TextNode' = 'TextNode';
    // private text: SplitText;

    public get textRaw(): string {
        // return this.text.raw;
        return '';
    }

    public setText(text: string): void {
        // if (this.text && this.text.raw !== text) {
        //     this.text = new SplitText(text);
        //     this.setYogaOptions({
        //         height: this.text.height,
        //         width: this.text.width
        //     });
        // }
    }
}
