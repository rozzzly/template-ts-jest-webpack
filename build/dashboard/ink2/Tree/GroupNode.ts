import { NodeInstance } from '.';
import { TreeNode } from './TreeNode';
import { Style, StyleOverride } from '../Text/Style';
import RenderContainer from '../Renderer/RenderContainer';
import { YogaOptions } from './YogaNode';

export class GroupNode extends TreeNode<'GroupNode'> {
    public kind: 'GroupNode' = 'GroupNode';
    public children: NodeInstance[] = [];


    public constructor(yogaOpts: Partial<YogaOptions>, override: StyleOverride) {
        super(yogaOpts, override);
    }

    public layout(): void {
        super.layout();
        for (let len = this.children.length, i = 0; i < len; i++) {
            this.children[i].layout();
        }
    }

    public dispose(): void {
        for (let len = this.children.length, i = 0; i < len; i++) {
            this.children[i].dispose();
        }
        super.dispose();
    }

    public link(parent: GroupNode, index: number) {
        super.link(parent, index);
        for (let len = this.children.length, i = 0; i < len; i++) {
            this.children[i].link(this, i);
        }
    }

    public cascadeStyle(): boolean {
        if (super.cascadeStyle()) {
            for (let len = this.children.length, i = 0; i < len; i++) {
                this.children[i].cascadeStyle();
            }
            return true;
        } else {
            return false;
        }
    }

    public getChildAt(index: number): NodeInstance {
        if (index < 0 || index >= this.children.length) {
            throw new Error('out of bounds');
        } else {
            return this.children[index];
        }
    }

    public prependChild(node: NodeInstance): NodeInstance {
        this.children.unshift(node);
        node.link(this, 0);
        return node;
    }

    public appendChild(node: NodeInstance): NodeInstance {
        this.children.push(node);
        node.link(this, this.children.length - 1);
        return node;
    }

    public insertAt(node: NodeInstance, index: number): NodeInstance {
        if (index < 0 || index > this.children.length) {
            throw new Error('out of bounds');
        } else {
            this.children = this.children.slice(0, index).concat(node, ...this.children.slice(index));
            node.link(this, index);
            return node;
        }

    }

    /**
     * @param node the node to insert
     * @param referenceNode the node which the new node will be inserted insert after / if null: prepend to children
     */
    public insertAfter(node: NodeInstance, referenceNode: NodeInstance | null): NodeInstance {
        if (referenceNode === null) {
            return this.prependChild(node);
        } else {
            const index = this.children.indexOf(node);
            if (index !== -1) {
                return this.insertAt(node, index + 1);
            } else {
                throw new Error('Given reference node is not a child.');
            }
        }
    }

    /**
     * @param node the node to insert
     * @param referenceNode the node which the new node will be inserted before / if null: prepend to children
     */
    public insertBefore(node: NodeInstance, referenceNode: NodeInstance | null): NodeInstance {
        if (referenceNode === null) {
            return this.appendChild(node);
        } else {
            const index = this.children.indexOf(node);
            if (index !== -1) {
                return this.insertAt(node, index);
            } else {
                throw new Error('Given reference node is not a child.');
            }
        }
    }

    public removeChildAt(index: number): NodeInstance {
        if (index < 0 || index >= this.children.length - 1) {
            throw new Error('out of bounds');
        } else {
            const discardedChild = this.children[index];
            this.children = this.children.slice(0, index).concat(this.children.slice(index + 1));
            discardedChild.dispose();
            return discardedChild;
        }
    }

    public removeChild(node: NodeInstance): NodeInstance {
        const index = this.children.indexOf(node);
        if (index !== -1) {
            return this.removeChildAt(index);
        } else {
            throw new Error('Given node is not children.');
        }
    }

    public countChildren(): number {
        return this.children.length;
    }
}
export default GroupNode;
