import { ContainerNode } from './ContainerNode';
import { TextNode } from './TextNode';
import { baseStyle } from '../Text/Style';
import { literalsEnum, ExtractLiterals } from '../misc';

export const NodeKind = literalsEnum(
    'ContainerNode',
    'TextNode'
);
export type NodeKind = ExtractLiterals<typeof NodeKind>;


export type NodeInstance = (
    | ContainerNode
    | TextNode
);

export class RootNode extends ContainerNode {
    public parent = null;
    public override = {};
    public style = baseStyle;
}
