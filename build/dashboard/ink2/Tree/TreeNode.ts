import { Style, StyleOverride, baseStyle } from '../Text/Style';
import { YogaProps } from './yoga/props';
import GroupNode from './GroupNode';
import { NodeKind } from '../Tree';
import YogaHandle from './yoga/YogaHandle';
import RenderContainer from '../Renderer/RenderContainer';
import RenderGrid from '../Renderer/RenderGrid';
import { NodeSet } from './NodeSet';


export interface TreeNodeWithAncestry {
    dirty: boolean;
    parent: GroupNode | null;
    markDirty(): void;
    dispose(): void;
    link(parent: GroupNode, index: number): void;
}

export interface TreeNodeWithStyle extends TreeNodeWithAncestry {
    style: Style;
    override: StyleOverride;

    setOverride(override: StyleOverride): void;
    cascadeStyle(): void;
}

export abstract class TreeNode<K extends NodeKind> implements TreeNodeWithStyle {
    public kind: K;
    public dirty: boolean;
    public style: Style;
    public yoga: YogaHandle;
    public owningSet: NodeSet | null;
    public grid: RenderGrid | null;
    public parent: GroupNode | null;
    public renderContainer: RenderContainer;
    public override: StyleOverride;

    public constructor(yogaOptions: Partial<YogaProps> = {}, override: StyleOverride = {}) {
        this.grid = null;
        this.parent = null;
        this.dirty = true;
        this.override = override;
        this.yoga = new YogaHandle(this as any, yogaOptions);
        this.renderContainer = new RenderContainer(this as any);
    }

    public layout(): void {
        if (this.yoga.node) {
            this.renderContainer.updateGeometry(this.yoga.node.getComputedLayout());
        } else {
            throw new Error();
        }
    }

    public markDirty(): void {
        this.dirty = true;
        if (this.parent && !this.parent.dirty) {
            // only propagate up if ancestors don't know they have dirty children
            this.parent.markDirty();
        }
        if (this.owningSet && !this.owningSet.dirty) {
            this.owningSet.markDirty();
        }
    }

    public setOverride(override: StyleOverride): void {
        this.override = { ...override };
        this.cascadeStyle();
    }

    public cascadeStyle(): void {
        const old = this.style;
        let inherited;
        if (this.owningSet && this.owningSet.style) {
            inherited = this.owningSet.style;
        } else if (this.parent && this.parent.style) {
            inherited = this.parent.style;
        } else {
            inherited = Style.base;
        }
        this.style = inherited.override(this.override);
        if (old && !this.style.equalTo(old)) {
            this.markDirty();
        }
    }

    public dispose(): void {
        if (this.yoga.node) {
            this.yoga.dispose();
        }
        if (this.grid) {
            this.grid.isLayoutDirty = true;
            this.renderContainer.grid = null;
        }
        this.owningSet = null;
        this.parent = null;
        this.grid = null;
    }

    public link(parent: GroupNode, index: number): void {
        if (this.grid) {
            this.dispose();
        }
        this.parent = parent;
        this.grid = parent.grid;
        this.cascadeStyle();
        this.markDirty();
        if (this.grid) {
            this.renderContainer.grid = this.grid;
            this.grid.isLayoutDirty = true;
        }
        this.yoga.link(index);
    }
}
export default TreeNode;
