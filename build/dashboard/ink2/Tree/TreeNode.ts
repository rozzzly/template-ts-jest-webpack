import { literalsEnum, ExtractLiterals } from '../misc';
import { YogaNode, YogaOptions } from './YogaNode';
import { Style, StyleOverride, baseStyle } from '../Text/Style';
import { isEqual } from 'lodash';
import GroupNode from './GroupNode';
import { NodeKind, NodeInstance } from '../Tree';
import YogaHandle from './YogaHandle';
import RenderContainer from '../Renderer/RenderContainer';


export abstract class TreeNode<K extends NodeKind = NodeKind> {
    public kind: K;
    public parent: GroupNode | null = null;
    public renderContainer: RenderContainer;
    public dirty: boolean;
    public yoga: YogaHandle;
    protected linked: boolean = false;
    protected style: Style;
    protected override: StyleOverride;

    public constructor(yogaOptions: Partial<YogaOptions>, override: StyleOverride) {
        this.parent = null;
        this.setTextStyle(override);
        this.yoga = new YogaHandle(yogaOptions, this);
        this.renderContainer = new RenderContainer(this as any);
    }

    public layout(): void {
        if (this.yoga.node) {
            this.renderContainer.updateGeometry(this.yoga.node.getComputedLayout());
        } else {
            throw new Error();
        }
    }

    public setYogaOpts(opts: Partial<YogaOptions>): void {
        this.yoga.setOptions(opts);
    }

    public setTextStyle(styleData: StyleOverride): void {
        this.override = { ...styleData };
        this.cascadeStyle();
    }

    public cascadeStyle(): boolean {
        const inherited = this.parent ? this.parent.style : baseStyle;
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
