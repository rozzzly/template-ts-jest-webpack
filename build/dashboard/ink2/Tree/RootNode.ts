import * as yoga from 'yoga-layout';
import { Style, StyleOverride } from '../Text/Style';
import GroupNode from './GroupNode';

export class RootNode extends GroupNode {
    public parent: null = null;
    public override: StyleOverride = {};
    public style: Style = Style.base;
    public width: number;
    public height: number;

    public constructor(width: number, height: number) {
        super({ width, height });
        this.width = width;
        this.height = height;
        this.yoga.link();
    }

    public resize(width: number, height: number) {
        this.yoga.mergeOptions({ width, height });
        this.width = width;
        this.height = height;
    }

    public layout(): void {
        this.yoga.node!.calculateLayout(this.width, this.height, yoga.DIRECTION_LTR);
        super.layout();
    }
}
export default RootNode;
