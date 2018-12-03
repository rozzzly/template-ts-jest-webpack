import { ChildNode } from '.';
import GroupNode, { TreeNodeWithChildren } from './GroupNode';
import Style, { StyleOverride } from '../Text/Style';
import { TreeNodeWithStyle } from './TreeNode';

export class NodeSet implements TreeNodeWithChildren, TreeNodeWithStyle {
    public kind: 'NodeSet' = 'NodeSet';
    public dirty: boolean;
    public parent: GroupNode | null;
    public style: Style;
    public override: StyleOverride;
    public children: ChildNode[];

    public constructor(override: StyleOverride) {
        this.parent = null;
        this.children = [];
        this.override = override;
    }

    public setOverride(override: StyleOverride): void {
        this.override = { ...override };
        this.cascadeStyle();
    }
    public cascadeStyle(): void {
        const old = this.style;
        let inherited;
        if (this.parent && this.parent.style) {
            inherited = this.parent.style;
        } else {
            inherited = Style.base;
        }
        this.style = inherited.override(this.override);
        if (old && !this.style.equalTo(old)) {
            this.markDirty();
            for (let child, i = 0; child = this.children[i]; i++) {
                child.cascadeStyle();
            }
        }
    }

    public dispose(): void {
        for (let child, i = 0; child = this.children[i]; i++) {
            child.dispose();
        }
    }
    public link(parent: GroupNode, index: number): void {
        for (let child, i = 0; child = this.children[i]; i++) {
            child.link(parent, index + i);
        }
    }

    public markDirty(): void {
        this.dirty = true;
        if (this.parent) {
            if (!this.parent.dirty) { // only propagate up if ancestors don't know they have dirty children
                this.parent.markDirty();
            }
        }
    }

    public getChildAt(index: number): ChildNode | never {
        if (index < 0 || index >= this.children.length) {
            throw new RangeError('index out of range');
        } else {
            return this.children[index];
        }
    }

    public prependChild(node: ChildNode): ChildNode {
        node.owningSet = this;
        if (this.parent) {
            if (this.children.length) {
                this.parent.insertBefore(node, this.children[0]);
            } else {
                this.parent.prependChild(node);
            }
        }
        this.children.unshift(node);
        return node;
    }

    public appendChild(node: ChildNode): ChildNode {
        node.owningSet = this;
        if (this.parent) {
            if (this.children.length) {
                this.parent.insertAfter(node, this.children[this.children.length - 1]);
            } else {
                this.parent.appendChild(node);
            }
        }
        this.children.push(node);
        return node;
    }

    public removeChildAt(index: number): ChildNode | never {
        if (index < 0 || index >= this.children.length) {
            throw new RangeError('out of bounds');
        } else {
            const discardedChild = this.children[index];
            discardedChild.owningSet = null;
            if (this.parent) {
                this.parent.removeChild(discardedChild);
            }
            this.children = this.children.slice(0, index).concat(this.children.slice(index + 1));
            return discardedChild;
        }
    }

    public removeChild(node: ChildNode): ChildNode | never {
        const index = this.children.indexOf(node);
        if (index !== -1) {
            return this.removeChildAt(index);
        } else {
            throw new ReferenceError('Given node is not children.');
        }
    }

    public insertAt(node: ChildNode, index: number): ChildNode | never {
        if (index < 0 || index > this.children.length) {
            throw new RangeError('out of bounds');
        } else {
            if (index === 0) {
                return this.prependChild(node);
            } else if (index === this.children.length) {
                return this.appendChild(node);
            } else {
                node.owningSet = this;
                let ref = this.children[index];
                this.children = this.children.slice(0, index).concat(node, ...this.children.slice(index));
                if (this.parent) {
                    this.parent.insertBefore(node, ref);
                }
                return node;
            }
        }
    }
    public insertBefore(node: ChildNode, referenceNode: ChildNode | null): ChildNode | never {
        if (referenceNode) {
            const index = this.children.indexOf(referenceNode);
            if (index !== -1) {
                return this.insertAt(node, index);
            } else {
                throw new ReferenceError('Given reference node is not a child.');
            }
        } else {
            return this.appendChild(node);
        }
    }
    public insertAfter(node: ChildNode, referenceNode: ChildNode | null): ChildNode {
        if (referenceNode) {
            const index = this.children.indexOf(referenceNode);
            if (index !== -1) {
                return this.insertAt(node, index + 1);
            } else {
                throw new ReferenceError('Given reference node is not a child.');
            }
        } else {
            return this.prependChild(node);
        }
    }
    public countChildren(): number {
        return this.children.length;
    }

}
