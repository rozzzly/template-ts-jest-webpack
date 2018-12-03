import { GroupNode } from './GroupNode';
import { TextNode } from './TextNode';
import { literalsEnum, ExtractLiterals } from '../misc';
import RootNode from './RootNode';
import { NodeSet } from './NodeSet';

export const NodeKind = literalsEnum(
    'GroupNode',
    'TextNode',
    'NodeSet'
);
export type NodeKind = ExtractLiterals<typeof NodeKind>;

export type ParentNode = (
    | RootNode
    | GroupNode
);

export type ChildNode = (
    | GroupNode
    | TextNode
);

export type VirtualChildNode = (
    | ChildNode
    | NodeSet
);

export type NodeInstance = (
    | RootNode
    | GroupNode
    | TextNode
);

export type VirtualNodeInstance = (
    | NodeInstance
    | NodeSet
);
