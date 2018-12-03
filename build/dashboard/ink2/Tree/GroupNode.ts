import { ChildNode, VirtualChildNode, NodeKind } from '.';
import { TreeNode, TreeNodeWithAncestry } from './TreeNode';
import { StyleOverride } from '../Text/Style';
import { YogaProps } from './yoga/props';
import { GapFiller, defaultGapFiller } from '../Renderer/GapFiller';
import { ChildContextProvider } from 'react';
import { NodeSet } from './NodeSet';

export interface TreeNodeWithChildren extends TreeNodeWithAncestry {
    children: ChildNode[];
    /**
     * @param {number} index of the child to get
     * @returns {ChildNode} the child at the specified index
     * @throws {RangeError} throws when index is out of range
     */
    getChildAt(index: number): ChildNode | never;
    /**
     * Inserts a node before its children
     * @param {ChildNode} node the node to insert
     * @return {ChildNode} node which was inserted
     */
    prependChild(node: VirtualChildNode): VirtualChildNode;
    /**
     * Inserts a node after its children
     * @param {ChildNode} node the node to insert
     * @return {ChildNode} node which was inserted
     */
    appendChild(node: VirtualChildNode): VirtualChildNode;
    /**
     * Inserts a node at the given index.
     * @param {ChildNode} node the node to insert
     * @param {number} index index to insert node at
     * @return {ChildNode} node which was inserted
     * @throws {RangeError} throws when index is out of range
     */
    insertAt(node: VirtualChildNode, index: number): VirtualChildNode | never;
    /**
     * Inserts a node after a given referenceNode.
     * @param {ChildNode} node the node to insert
     * @param {ChildNode|null} referenceNode the node which the new node will be inserted after / if null: prepend to children
     * @return {ChildNode} node which was inserted
     * @throws {ReferenceError} throws when given referenceNode is not a child of this node
     */
    insertAfter(node: VirtualChildNode, referenceNode: VirtualChildNode | null): VirtualChildNode | never;
    /**
     * Inserts a node before a given referenceNode.
     * @param {ChildNode} node the node to insert
     * @param {ChildNode|null} referenceNode the node which the new node will be inserted before / if null: append to children
     * @return {ChildNode} node which was inserted
     * @throws {ReferenceError} throws when given referenceNode is not a child of this node
     */
    insertBefore(node: VirtualChildNode, referenceNode: VirtualChildNode | null): VirtualChildNode | never;
    /**
     * Removes the child at the given index
     * @param {number} index index of children to remove
     * @returns {ChildNode} node which was removed
     * @throws {RangeError} throws when index is out of range
     */
    removeChildAt(index: number): ChildNode | never;
    /**
     * Removes the given child
     * @param {ChildNode} child the child to remove
     * @returns {ChildNode} node which was removed
     * @throws {ReferenceError} throws when given referenceNode is not a child of this node
     */
    removeChild(child: VirtualChildNode): VirtualChildNode | never;
    /**
     * Gets the number of children
     * @returns {number} the number of children
     */
    countChildren(): number;
}

export class GroupNode extends TreeNode<'GroupNode'> implements TreeNodeWithChildren {
    public kind: 'GroupNode' = 'GroupNode';
    public children: ChildNode[] = [];
    public gapFiller: GapFiller = defaultGapFiller;

    public constructor(yogaOpts: Partial<YogaProps>, override: StyleOverride) {
        super(yogaOpts, override);
    }

    public layout(): void {
        super.layout();
        for (let child, i = 0; child = this.children[i]; i++) {
            child.layout();
        }
    }

    public dispose(): void {
        for (let child, i = 0; child = this.children[i]; i++) {
            child.dispose();
        }
        super.dispose();
    }

    public link(parent: GroupNode, index: number): void {
        super.link(parent, index);
        for (let child, i = 0; child = this.children[i]; i++) {
            child.link(this, i);
        }
    }

    public cascadeStyle(): void {
        super.cascadeStyle();
        let lastSet: null | NodeSet = null;
        for (let child, i = 0; child = this.children[i]; i++) {
            if (child.owningSet) {
                if (lastSet !== child.owningSet) {
                    lastSet = child.owningSet;
                    child.owningSet.cascadeStyle();
                }
            } else {
                lastSet = null;
                child.cascadeStyle();
            }

        }
    }

    public getChildAt(index: number): ChildNode | never {
        if (index < 0 || index >= this.children.length) {
            throw new RangeError('out of bounds');
        } else {
            return this.children[index];
        }
    }

    public prependChild(node: VirtualChildNode): VirtualChildNode {
        if (node.kind === 'NodeSet') {
            for (let child, i = node.children.length - 1; child = node.children[i]; i--) {
                this.prependChild(child);
            }
            return node;
        } else {
            this.children.unshift(node);
            node.link(this, 0);
            return node;
        }
    }

    public appendChild(node: VirtualChildNode): VirtualChildNode {
        if (node.kind === NodeKind.NodeSet) {
            for (let child, i = 0; child = node.children[i]; i++) {
                this.appendChild(child);
            }
            return node;
        } else {
            this.children.push(node);
            node.link(this, this.children.length - 1);
            return node;
        }
    }

    public insertAt(node: VirtualChildNode, index: number): VirtualChildNode | never {
        if (index < 0 || index > this.children.length) {
            throw new RangeError('out of bounds');
        } else {
            if (node.kind === NodeKind.NodeSet) {
                for (let child, i = node.children.length - 1; child = node.children[i]; i--) {
                    this.insertAt(child, index);
                }
                return node;
            } else {
                this.children = this.children.slice(0, index).concat(node, ...this.children.slice(index));
                node.link(this, index);
                return node;
            }
        }
    }

    public insertAfter(node: VirtualChildNode, referenceNode: VirtualChildNode | null): VirtualChildNode | never {
        if (referenceNode === null) {
            return this.prependChild(node);
        } else {
            const refNode = ((referenceNode.kind === NodeKind.NodeSet)
                ? referenceNode.children[referenceNode.children.length - 1]
                : referenceNode
            );
            if (!refNode) {
                throw new ReferenceError('Given reference node is not a child.');
            } else {
                const index = this.children.indexOf(refNode);
                if (index !== -1) {
                    return this.insertAt(node, index + 1);
                } else {
                    throw new ReferenceError('Given reference node is not a child.');
                }
            }
        }
    }

    public insertBefore(node: VirtualChildNode, referenceNode: VirtualChildNode | null): VirtualChildNode | never {
        if (referenceNode === null) {
            return this.appendChild(node);
        } else {
            const refNode = ((referenceNode.kind === NodeKind.NodeSet)
                ? referenceNode.children[referenceNode.children.length - 1]
                : referenceNode
            );
            if (!refNode) {
                throw new ReferenceError('Given reference node is not a child.');
            } else {
                const index = this.children.indexOf(refNode);
                if (index !== -1) {
                    return this.insertAt(node, index);
                } else {
                    throw new ReferenceError('Given reference node is not a child.');
                }
            }
        }
    }

    public removeChildAt(index: number): ChildNode | never {
        if (index < 0 || index >= this.children.length) {
            throw new RangeError('out of bounds');
        } else {
            const discardedChild = this.children[index];
            this.children = this.children.slice(0, index).concat(this.children.slice(index + 1));
            discardedChild.dispose();
            return discardedChild;
        }
    }

    public removeChild(node: VirtualChildNode): VirtualChildNode | never {
        if (node.kind === NodeKind.NodeSet) {
            for (let child, i = 0; child = this.children[i]; i++) {
                if (child.owningSet === node) {
                    this.removeChild(child);
                }
            }
            return node;
        } else {
            const index = this.children.indexOf(node);
            if (index !== -1) {
                return this.removeChildAt(index);
            } else {
                throw new ReferenceError('Given node is not children.');
            }
        }
    }

    public countChildren(): number {
        return this.children.length;
    }
}
export default GroupNode;
