import { Dimensions } from './RenderContainer';
import { RootNode, NodeInstance } from '../Tree';
import { Style, baseStyle } from '../Text/Style';


export class RenderGrid implements Dimensions {

    public root: RootNode;
    public grid: GridRow[];
    public width: number;
    public height: number;
    private dirtyRows: Set<number>;

    public constructor(width: number, height: number, treeRoot: RootNode) {
        this.height = height;
        this.width = width;
        this.root = treeRoot;
        this.dirtyRows = new Set();
        this.markRowSpanDirty(0, height);
    }

    public plotTree(): void {

    }

    public resize(height: number, width: number): boolean {
        if (this.height !== height || this.width !== width) {
            this.height = height;
            this.width = width;
            this.dirtyRows.clear();
            this.markRowSpanDirty(0, height);
            return true;
        } else return false;
    }

    public markRowDirty(index: number): void {
        this.dirtyRows.add(index);
    }
    public markRowSpanDirty(start: number, count: number): void {
        const end = start + count;
        for (let index = start; index < end; index++) {
            this.dirtyRows.add(index);
        }
    }
    public markRowsDirty(indexes: number[]): void {
        const len = indexes.length;
        for (let i = 0; i < len; i++) {
            this.dirtyRows.add(indexes[i]);
        }
    }
    public markRowClean(index: number): void {
        this.dirtyRows.delete(index);
    }
    public markRowSpanClean(start: number, count: number): void {
        if (start === 0 && count === this.height) this.dirtyRows.clear();
        else {
            const end = start + count;
            for (let index = start; index < end; index++) {
                this.dirtyRows.delete(index);
            }
        }
    }
    public markRowsClean(indexes: number[]): void {
        const len = indexes.length;
        for (let i = 0; i < len; i++) {
            this.dirtyRows.delete(indexes[i]);
        }
    }
}
export default RenderGrid;
