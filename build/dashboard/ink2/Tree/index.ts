import { GroupNode } from './GroupNode';
import { TextNode } from './TextNode';
import { baseStyle } from '../Text/Style';
import { literalsEnum, ExtractLiterals } from '../misc';

export const NodeKind = literalsEnum(
    'GroupNode',
    'TextNode'
);
export type NodeKind = ExtractLiterals<typeof NodeKind>;


export type NodeInstance = (
    | GroupNode
    | TextNode
);

export class RootNode extends GroupNode {
    public parent = null;
    public override = {};
    public style = baseStyle;
}
