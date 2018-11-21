import { Style, StyleOverride, baseStyle } from '../Text/Style';
import { YogaProps } from './yoga/props';
import GroupNode from './GroupNode';
import { NodeKind } from '../Tree';
import YogaHandle from './yoga/YogaHandle';
import RenderContainer from '../Renderer/RenderContainer';


export abstract class TreeNode<K extends NodeKind> {
    public kind: K;
    public style: Style;
    public dirty: boolean;
    public yoga: YogaHandle;
    public parent: GroupNode | null = null;
    public renderContainer: RenderContainer;
    protected linked: boolean = false;
    protected override: StyleOverride;

    public constructor(yogaOptions?: Partial<YogaProps>, override: StyleOverride = {}) {
        this.parent = null;
        this.setStyle(override);
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

    public cascadeStyle(): boolean {
        const inherited = this.parent ? this.parent.style : Style.base;
        const old = this.style;
        this.style = inherited.override(this.override);
        return this.style === old;
    }

    public dispose(): void {
        if (this.yoga.node) {
            this.yoga.dispose();
        }
        this.parent = null;
        this.linked = false;
    }

    public link(parent: GroupNode | null, index: number) {
        if (this.linked) {
            this.dispose();
        }
        this.parent = parent;
        this.linked = true;
        this.yoga.link(index);
        this.cascadeStyle();
    }
}
export default TreeNode;
