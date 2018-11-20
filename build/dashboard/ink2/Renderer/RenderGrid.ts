import { Dimensions } from './RenderContainer';
import  { NodeInstance } from '../Tree';
import { Style, baseStyle } from '../Text/Style';
import RootNode from '../Tree/RootNode';
import GridRow from './GridRow';


export class RenderGrid implements Dimensions {

    public root: RootNode;
    public rows: GridRow[];
    public width: number;
    public height: number;
    private dirtyRows: Set<number>;

    public get isDirty(): boolean {
        return !!this.dirtyRows.size;
    }

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.root = new RootNode(width, height);
        this.dirtyRows = new Set();
        this.createRows();
    }

    private createRows() {
        this.rows = []; // discard existing rows, if any-when grid is resized, entire tree will be rebuilt
        for (let i = 0; i < this.height; i++) {
            this.rows.push(new GridRow(this, i));
            this.dirtyRows.add(i);
        }
    }

    public plotRows(): void {
        for (let index of this.dirtyRows.values()) {
            this.root.renderContainer.plotRow(this.rows[index]);
        }
        this.dirtyRows.clear();
    }

    public resize(height: number, width: number): boolean {
        if (this.height !== height || this.width !== width) {
            this.height = height;
            this.width = width;
            this.createRows();
            this.root.layout();
            return true;
        } else return false;
    }

    public markRowDirty(index: number): void {
        this.dirtyRows.add(index);
        this.rows[index].dirty = true;
    }
    public markRowSpanDirty(start: number, count: number): void {
        for (let end = start + count,  index = start; index < end; index++) {
            this.dirtyRows.add(index);
            this.rows[index].dirty = true;
        }
    }
    public markRowsDirty(indexes: number[]): void {
        for (let len = indexes.length, i = 0; i < len; i++) {
            this.dirtyRows.add(indexes[i]);
            this.rows[indexes[i]].dirty = true;
        }
    }
    public markRowClean(index: number): void {
        this.dirtyRows.delete(index);
        this.rows[index].dirty = false;
    }
    public markRowSpanClean(start: number, count: number): void {
        if (start === 0 && count === this.height) this.dirtyRows.clear();
        else {
            for (let end = start + count, i = start; i < end; i++) {
                this.dirtyRows.delete(i);
                this.rows[i].dirty = false;
            }
        }
    }
    public markRowsClean(indexes: number[]): void {
        for (let len = indexes.length, i = 0; i < len; i++) {
            this.dirtyRows.delete(indexes[i]);
            this.rows[i].dirty = false;
        }
    }
}
export default RenderGrid;
