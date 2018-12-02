import { Style, StyleOverride, baseStyle } from '../Text/Style';
import { YogaProps } from './yoga/props';
import GroupNode from './GroupNode';
import { NodeKind } from '../Tree';
import YogaHandle from './yoga/YogaHandle';
import RenderContainer from '../Renderer/RenderContainer';
import RenderGrid from '../Renderer/RenderGrid';


export abstract class TreeNode<K extends NodeKind> {
    public kind: K;
    public style: Style;
    public yoga: YogaHandle;
    public grid: RenderGrid | null;
    public parent: GroupNode | null;
    public renderContainer: RenderContainer;
    public override: StyleOverride;

    public constructor(yogaOptions: Partial<YogaProps> = {}, override: StyleOverride = {}) {
        this.grid = null;
        this.parent = null;
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

    public setStyle(override: StyleOverride): void {
        this.override = { ...override };
        this.cascadeStyle();
    }

    public cascadeStyle(): void {
        const inherited = (this.parent && this.parent.style) ? this.parent.style : Style.base;
        this.style = inherited.override(this.override);
    }

    public dispose(): void {
        if (this.yoga.node) {
            this.yoga.dispose();
        }
        this.parent = null;
        this.grid = null;
    }

    public link(parent: GroupNode, index: number) {
        if (this.grid) {
            this.dispose();
        }
        this.parent = parent;
        this.grid = parent.grid;
        this.yoga.link(index);
        this.cascadeStyle();
    }
}
export default TreeNode;
