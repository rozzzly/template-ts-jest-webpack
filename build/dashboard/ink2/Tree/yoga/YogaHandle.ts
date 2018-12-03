import { isEqual } from 'lodash';
import yoga, { Node, YogaNode } from 'yoga-layout';
import { YogaProps, InternalYogaProps, internalizeProps, defaultProps } from './props';
import { NodeInstance } from '../../Tree';
import { YogaFlexDirection, YogaFlexDirectionValues } from './constants';


const initialProps: InternalYogaProps = {
    ...defaultProps,
    flexDirection: YogaFlexDirectionValues.column,
    flexShrink: 0
};

export class YogaHandle {

    public node: YogaNode | null;
    public owner: NodeInstance;
    public active: InternalYogaProps;
    public staged: InternalYogaProps;


    public constructor(owner: NodeInstance, props: Partial<YogaProps> = {}) {
        this.active = { ...initialProps };
        this.owner = owner;
        this.setProps(props);
    }

    public mergeProps(incoming: Partial<YogaProps>): void {
        const old = this.staged;
        this.staged = internalizeProps(incoming, this.staged);
        this.owner.grid!.isLayoutDirty = true;
        const changed = !isEqual(this.staged, old);
        if (changed) {
            if (this.owner.grid) {
                this.owner.grid!.isLayoutDirty = true;
            }
            if (this.node) {
                this.applyProps();
            }
        }
    }

    public setProps(incoming: Partial<YogaProps>): void {
        const old = this.staged;
        if (Object.keys(incoming).length === 0) { // quick test to avoid calling internalizeProps() when it will have no effect
            this.staged = { ...defaultProps };
        } else {
            this.staged = internalizeProps(incoming);
        }
        const changed = !isEqual(this.staged, old);
        if (changed) {
            if (this.owner.grid) {
                this.owner.grid!.isLayoutDirty = true;
            }
            if (this.node) {
                this.applyProps();
            }
        }
    }

    private applyProps(): void {
        if (!this.node) throw new ReferenceError();
        else {
            const s = this.staged, a = this.active, n = this.node; // save some repetitive typing
            if (s.justifyContent !== a.justifyContent) n.setJustifyContent(s.justifyContent);
            if (s.flexDirection !== a.flexDirection) n.setFlexDirection(s.flexDirection);
            if (s.alignContent !== a.alignContent) n.setAlignContent(s.alignContent);
            if (s.alignItems !== a.alignItems) n.setAlignItems(s.alignItems);
            if (s.alignSelf !== a.alignSelf) n.setAlignSelf(s.alignSelf);
            if (s.flexBasis !== a.flexBasis) n.setFlexBasis(s.flexBasis);
            if (s.flexGrow !== a.flexGrow) n.setFlexGrow(s.flexGrow);
            if (s.flexShrink !== a.flexShrink) n.setFlexShrink(s.flexShrink);
            if (s.height !== a.height) n.setHeight(s.height);
            if (s.maxHeight !== a.maxHeight) n.setMaxHeight(s.maxHeight);
            if (s.minHeight !== a.minHeight) n.setMinHeight(s.minHeight);
            if (s.width !== a.width) n.setWidth(s.width);
            if (s.maxWidth !== a.maxWidth) n.setMaxWidth(s.maxWidth);
            if (s.minWidth !== a.minWidth) n.setMinWidth(s.minWidth);
            if (s.margin.left !== a.margin.left) n.setMargin(yoga.EDGE_LEFT, s.margin.left as any);
            if (s.margin.top !== a.margin.top) n.setMargin(yoga.EDGE_TOP, s.margin.top as any);
            if (s.margin.right !== a.margin.right) n.setMargin(yoga.EDGE_RIGHT, s.margin.right as any);
            if (s.margin.bottom !== a.margin.bottom) n.setMargin(yoga.EDGE_BOTTOM, s.margin.bottom as any);
            if (s.padding.left !== a.padding.left) n.setPadding(yoga.EDGE_LEFT, s.padding.left as any);
            if (s.padding.top !== a.padding.top) n.setPadding(yoga.EDGE_TOP, s.padding.top as any);
            if (s.padding.right !== a.padding.right) n.setPadding(yoga.EDGE_RIGHT, s.padding.right as any);
            if (s.padding.bottom !== a.padding.bottom) n.setPadding(yoga.EDGE_BOTTOM, s.padding.bottom as any);
            this.active = this.staged;
        }
    }


    public link(index?: number): void {
        if (this.node) this.dispose();
        this.node = Node.create();
        if (index !== undefined && this.owner.parent && this.owner.parent.yoga.node) {
            this.owner.parent.yoga.node.insertChild(this.node, index);
        }
        this.applyProps();
    }

    public dispose(): void {
        if (this.node) {
            if (this.owner.parent && this.owner.parent.yoga.node) {
                this.owner.parent.yoga.node.removeChild(this.node);
            }

            this.node.free();
            this.node = null;
        }
        this.active = { ...initialProps };
    }
}
export default YogaHandle;
