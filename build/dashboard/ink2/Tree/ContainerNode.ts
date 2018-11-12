import { NodeInstance } from '../Tree';
import { BaseNode } from './BaseNode';
import { Style } from '../Text/Style';

export class ContainerNode extends BaseNode<'ContainerNode'> {
    public kind: 'ContainerNode' = 'ContainerNode';
    protected children: NodeInstance[] = [];

    public dispose(): void {
        this.children.forEach(node => node.dispose());
        super.dispose();

    }

    public link(parent: ContainerNode, index: number) {
        super.link(parent, index);
        for (let i = 0; i < this.children.length; i++) {
            this.children[i].link(this, i);
        }
    }

    public cascadeTextStyle(inherited: Style): boolean {
        if (super.cascadeTextStyle(inherited)) {
            this.children.forEach(child => child.cascadeTextStyle(this.computed));
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
            this.children = [...this.children.slice(0, index), node, ...this.children.slice(index)];
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
            this.children = [...this.children.slice(0, index), ...this.children.slice(index + 1)];
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
