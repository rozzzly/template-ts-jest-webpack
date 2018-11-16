import { GroupNode } from './GroupNode';
import { TextNode } from './TextNode';
import { literalsEnum, ExtractLiterals } from '../misc';
import RootNode from './RootNode';

export const NodeKind = literalsEnum(
    'GroupNode',
    'TextNode'
);
export type NodeKind = ExtractLiterals<typeof NodeKind>;

export type NodeInstance = (
    | RootNode
    | GroupNode
    | TextNode
);
