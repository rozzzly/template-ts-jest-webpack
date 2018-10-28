import { isEqual } from 'lodash';
import { SplitText } from './textUtils';

export type NodeKind = (
    | 'ContainerNode'
    | 'TextNode'
);

export interface TextStyle {
    fgColor: any;
    bold: boolean;
    /// TODO pull these from string-ast
}

const defaultTextStyle: TextStyle = {
    bold: false
} as TextStyle;

export type YogaNode = any; /// TODO find/write type defs
export const YogaNode: YogaNode = {};

export interface YogaOptions {
    height: (
        | string
        | number
    );
    width: (
        | string
        | number
    );
    flexDirection: (
        | 'row'
        | 'row-reverse'
        | 'column'
        | 'column-reverse'
    );
}

const defaultYogaOptions: YogaOptions = {} as YogaOptions;

export abstract class BaseNode<K extends NodeKind> {
    public kind: K;
    public parent: ContainerNode | null = null;
    public yoga: YogaNode | null = null;
    protected yogaOpts: {
        current: YogaOptions;
        diff: Partial<YogaOptions>;
        staged: YogaOptions;
        stale: boolean;
    };

    protected linked: boolean = false;
    protected composedTextStyle: TextStyle;
    protected ownTextStyle: Partial<TextStyle>;

    public constructor(yogaOptions: Partial<YogaOptions> = {}) {
        this.ownTextStyle = {};
        this.yogaOpts = {
            current: {} as YogaOptions,
            diff: { ...defaultYogaOptions },
            staged: { ...defaultYogaOptions },
            stale: true
        };
    }

    public setTextStyle(nStyle: Partial<TextStyle>) {
        if (!isEqual(this.ownTextStyle, nStyle)) {
            this.ownTextStyle = { ...nStyle };
            this.cascadeTextStyle(this.parent ? this.parent.composedTextStyle : defaultTextStyle);
        }
    }

    public cascadeTextStyle(inherited: TextStyle): boolean {
        const nStyle = { ...inherited, ...this.ownTextStyle };
        const changed = isEqual(this.composedTextStyle, nStyle);
        this.composedTextStyle = nStyle;
        return changed;
    }

    public setYogaOptions(opts: Partial<YogaOptions>): void {
        const condensed = opts;
        const incoming = { ...defaultYogaOptions, ...condensed };
        if (!isEqual(this.yogaOpts.staged, incoming)) {
            Object.keys(incoming).forEach((key: keyof YogaOptions) => {
                if (this.yogaOpts.staged[key] !== incoming[key]) {
                    this.yogaOpts.staged[key] = this.yogaOpts.diff[key] = incoming[key];
                    if (this.yogaOpts.current[key] === incoming[key]) {
                        delete this.yogaOpts.diff[key];
                    }
                }
            });
            this.yogaOpts.stale = true;
        }

        if (this.yoga && this.yogaOpts.stale) this.applyYogaOptions();
    }

    protected applyYogaOptions(): void {
        if (!this.yoga) {
            throw new Error('applyYogaOptions called before node is linked.');
        } else if (this.yogaOpts.stale) {
            const { diff } = this.yogaOpts;


            // update "opts" state
            this.yogaOpts.current = {...this.yogaOpts.staged };
            this.yogaOpts.diff = {};
            this.yogaOpts.stale = false;
        }
    }

    public dispose(): void {
        if (this.yoga) {
            if (this.parent && this.parent.yoga) {
                this.parent.yoga.removeChild(this.yoga);
            }
            this.yoga.free();
            this.yoga = null;
        }
        this.yogaOpts = {
            current: { } as YogaOptions,
            staged: { ...this.yogaOpts.staged } ,
            diff: { ...this.yogaOpts.staged },
            stale: true,
        };
        this.parent = null;
        this.linked = false;
    }

    public createYoga() {
        this.yoga = YogaNode.create();
        this.applyYogaOptions();
    }

    public link(parent: ContainerNode | null, index: number) {
        if (this.linked) {
            this.dispose();
        }
        this.parent = parent;
        this.linked = true;
        this.createYoga();
        if (this.parent) {
            this.cascadeTextStyle(this.parent.composedTextStyle);

            if (this.parent.yoga) {
                this.parent.yoga.insertChild(this.yoga, index);
            }
        }
    }
}

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

    public cascadeTextStyle(inherited: TextStyle): boolean {
        if (super.cascadeTextStyle(inherited)) {
            this.children.forEach(child => child.cascadeTextStyle(this.composedTextStyle));
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

export class TextNode extends BaseNode<'TextNode'> {
    public kind: 'TextNode' = 'TextNode';
    private text: SplitText;



    public get textRaw(): string {
        return this.text.raw;
    }

    public setText(text: string): void {
        this.text = new SplitText(text);
        this.setYogaOptions({
            height: this.text.height,
            width: this.text.width
        });
    }
}

export type NodeInstance = (
    | ContainerNode
    | TextNode
);

export class RootNode extends ContainerNode {
}
