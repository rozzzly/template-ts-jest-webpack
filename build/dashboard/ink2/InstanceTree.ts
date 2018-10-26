type NodeKind = (
    | 'ContainerNode'
    | 'TextNode'
);

type YogaNode = any; /// TODO find/write type defs
const YogaNode: YogaNode = {};

abstract class BaseNode<K extends NodeKind> {
    public kind: K;
    public parent: ContainerNode | null;
    public yoga: YogaNode | null;
    protected linked: boolean;

    public dispose(): void {
        if (this.yoga) {
            if (this.parent && this.parent.yoga) {
                this.parent.yoga.removeChild(this.yoga);
            }
            this.yoga.free();
            this.yoga = null;
        }
        this.parent = null;
        this.linked = false;
    }

    public createYoga() {
        this.yoga = YogaNode.create();
    }

    public link(parent: ContainerNode | null, index: number) {
        if (this.linked) {
            this.dispose();
        }
        this.parent = parent;
        this.linked = true;
        this.createYoga();
        if (this.parent && this.parent.yoga) {
            this.parent.yoga.insertChild(this.yoga, index);
        }
    }
}

class ContainerNode extends BaseNode<'ContainerNode'> {
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

    public getChildAt(index: number): NodeInstance {
        if (index < 0 || index >= this.children.length) {
            throw new Error('out of bounds');
        } else {
            return this.children[index];
        }
    }

    public prependChild(node: NodeInstance): void {
        this.children.unshift(node);
        node.link(this, 0);
    }

    public appendChild(node: NodeInstance): void {
        this.children.push(node);
        node.link(this, this.children.length - 1);
    }

    public insertAt(node: NodeInstance, index: number): void {
        if (index < 0 || index > this.children.length) {
            throw new Error('out of bounds');
        } else {
            this.children = [...this.children.slice(0, index), node, ...this.children.slice(index)];
            node.link(this, index);
        }

    }

    /**
     * @param node the node to insert
     * @param referenceNode the node which the new node will be inserted insert after / if null: prepend to children
     */
    public insertAfter(node: NodeInstance, referenceNode: NodeInstance | null): void {
        if (referenceNode === null) {
            this.prependChild(node);
        } else {
            const index = this.children.indexOf(node);
            if (index !== -1) {
                this.insertAt(node, index + 1);
            } else {
                throw new Error('Given reference node is not a child.');
            }
        }
    }

    /**
     * @param node the node to insert
     * @param referenceNode the node which the new node will be inserted before / if null: prepend to children
     */
    public insertBefore(node: NodeInstance, referenceNode: NodeInstance | null): void {
        if (referenceNode === null) {
            this.appendChild(node);
        } else {
            const index = this.children.indexOf(node);
            if (index !== -1) {
                this.insertAt(node, index);
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

class TextNode extends BaseNode<'TextNode'> {
    public kind: 'TextNode' = 'TextNode';
}

type NodeInstance = (
    | ContainerNode
    | TextNode
);
