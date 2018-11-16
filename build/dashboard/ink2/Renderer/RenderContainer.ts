import { TreeNode } from '../Tree/TreeNode';
import { NodeInstance, NodeKind } from '../Tree';
import { ComputedLayout } from '../Tree/YogaNode';
import { inRange } from '../misc';
import Coords from './Coords';
import { GridRow } from './GridRow';

export interface Dimensions {
    height: number;
    width: number;
}


export class RenderContainer implements Dimensions {

    public treeRef: NodeInstance;
    public dirty: boolean;
    public width: number;
    public height: number;
    public x: number;
    public y: number;
    public coords: Coords;
    public globalCoords: Coords;

    public constructor(treeRef: NodeInstance) {
        this.treeRef = treeRef;
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
        this.coords = {
            x0: this.x,
            x1: this.x + this.width,
            y0: this.y,
            y1: this.y + this.height
        };
        this.globalCoords = Coords.translate(this.coords, globalOffsetX, globalOffsetY);
    }

    public plotRow(row: GridRow): void {
        const { x0, x1, y0, y1 } = this.globalCoords;
        if (inRange(y0, y1, row.rowIndex, [false, true])) { // check if this container/it's children
            row.plot(this.treeRef, x0, this.width);
            if (this.treeRef.kind === NodeKind.GroupNode) {
                for (let child, i = 0; child = this.treeRef.children[i]; i++) {
                    child.renderContainer.plotRow(row);
                }
            }
        } // this child is not in this
    }
}
export default RenderContainer;
