import { TreeNode } from '../Tree/TreeNode';
import { NodeInstance } from '../Tree';
import { ComputedLayout } from '../Tree/YogaNode';

export interface GridDimensions {
    height: number;
    width: number;
}
export interface GridPosition {
    x: number;
    y: number;
}

export interface GridGeometry extends GridDimensions, GridPosition { }

export class RenderContainer implements GridGeometry {

    public treeRef: NodeInstance;
    public dirty: boolean;
    public width: number;
    public height: number;
    public x: number;
    public globalX: number;
    public y: number;
    public globalY: number;
    private fresh: boolean;

    public constructor(treeRef: NodeInstance) {
        this.treeRef = treeRef;
        this.fresh = true;
    }

    public updateGeometry(layout: ComputedLayout): void {
        this.width = layout.width;
        this.height = layout.height;
        this.x = layout.left;
        this.y = layout.top;
        let globalOffsetX = 0;
        let globalOffsetY = 0;
        let ancestor = this.treeRef.parent;
        while (ancestor) {
            globalOffsetX += ancestor.renderContainer.x;
            globalOffsetY += ancestor.renderContainer.y;
            ancestor = ancestor.parent;
        }
        this.globalX = globalOffsetX + this.x;
        this.globalY = globalOffsetY + this.y;
    }

    public render(number) {
        if (this.treeRef.kind === 'GroupNode') {
            for (let len = this.treeRef.children.length, i = 0; i < len; i++) {
                const child = this.treeRef.children[i];
                const renderChild = child.renderContainer;
                if (renderChild.x >= this.width) {
                    continue;
                } else {
                    if (renderChild.x + renderChild.width < 0) {
                        continue;
                    }
                }
            }
        } else {
        }
    }

    public markDirty(): void {
        this.dirty = true;
    }

    public markClean(): void {
    }
}
export default RenderContainer;
