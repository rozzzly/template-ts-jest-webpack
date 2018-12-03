import { NodeInstance, NodeKind } from '../Tree';
import { ComputedLayout } from '../Tree/yoga/props';
import RectCoords, { SpanCoords } from './Coords';
import { GridRow } from './GridRow';
import RowBuilder from './RowBuilder';
import RenderGrid from './RenderGrid';

export interface Dimensions {
    height: number;
    width: number;
}


export class RenderContainer implements Dimensions {

    public grid: RenderGrid | null;
    public treeRef: NodeInstance;
    public dirty: boolean;
    public width: number;
    public height: number;
    public localCoords: RectCoords;
    public globalCoords: RectCoords;
    public viewBox: RectCoords | null;

    public constructor(treeRef: NodeInstance) {
        this.treeRef = treeRef;
    }

    public updateGeometry(layout: ComputedLayout): void {
        const old = {
            viewBox: this.viewBox,
            localCoords: this.localCoords,
            globalCoords: this.globalCoords
        };
        this.width = layout.width;
        this.height = layout.height;

        this.localCoords = {
            x0: layout.left,
            x1: layout.left + this.width,
            y0: layout.top,
            y1: layout.top + this.height
        };

        const parent = this.treeRef.parent;
        let globalOffsetX = 0;
        let globalOffsetY = 0;
        let ancestor = parent;
        while (ancestor) {
            globalOffsetX += ancestor.renderContainer.localCoords.x0;
            globalOffsetY += ancestor.renderContainer.localCoords.y0;
            ancestor = ancestor.parent;
        }
        this.globalCoords = RectCoords.translate(this.localCoords, globalOffsetX, globalOffsetY);

        if (parent) {
            if (parent.renderContainer.viewBox) {
                this.viewBox = RectCoords.intersection(parent.renderContainer.viewBox, this.globalCoords);
            } else this.viewBox = null;
        } else { // this RenderContainer is the RootNode
            this.viewBox = this.globalCoords;
        }
        if (!old.globalCoords || !old.localCoords) {
            this.treeRef.markDirty();
            this.grid!.markRangeDirty({
                y0: this.globalCoords.y0,
                y1: this.globalCoords.y1 - 1
            });
        } else if (RectCoords.equalTo(old.globalCoords, this.globalCoords) || RectCoords.equalTo(old.localCoords, this.localCoords)) {
            this.treeRef.markDirty();
            this.grid!.markRangeDirty({
                y0: Math.min(old.globalCoords.y0, this.globalCoords.y0),
                y1: Math.min(old.globalCoords.y1, this.globalCoords.y1) - 1
            });
        } else if (old.viewBox || this.viewBox) {
            if (!old.viewBox || !this.viewBox || !RectCoords.equalTo(this.viewBox, old.viewBox)) {
                this.treeRef.markDirty();
                this.grid!.markRangeDirty({
                    y0: Math.min(old.globalCoords.y0, this.globalCoords.y0),
                    y1: Math.min(old.globalCoords.y1, this.globalCoords.y1) - 1
                });
            }
        }

    }

    public plotRow(row: GridRow): void {
        const { x0, x1, y0, y1 } = this.viewBox!; // assertion is safe because RootNode will always have viewBox, and child nodes without one will
        row.plot(this.treeRef, { x0, x1 }); // never be recursed into
        if (this.treeRef.kind === NodeKind.GroupNode) {
            for (let child, i = 0; child = this.treeRef.children[i]; i++) {
                const vBox = child.renderContainer.viewBox;
                if (vBox && RectCoords.containsRow(vBox, row.y)) { // check if this row is in container`s viewbox
                    child.renderContainer.plotRow(row);
                }
            }
        }
    }

    public render(builder: RowBuilder, coords: SpanCoords): void {
        if (this.treeRef.kind === NodeKind.GroupNode) {
            this.treeRef.gapFiller(builder, coords, this.treeRef.style);
        } else {
            const vBox = this.viewBox!; // render() will never be called for this container if it's not plotted (ie: viewBox === null)
            const offset = vBox.x0 - this.globalCoords.x0;
            builder.styledText(this.treeRef.style, this.treeRef.textRaw);
        }
    }
}
export default RenderContainer;
