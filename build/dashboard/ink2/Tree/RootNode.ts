import { baseStyle, Style, StyleOverride } from '../Text/Style';
import GroupNode from './GroupNode';

export class RootNode extends GroupNode {
    public parent: null = null;
    public override: StyleOverride = {};
    public style: Style = Style.base;
}
export default RootNode;
