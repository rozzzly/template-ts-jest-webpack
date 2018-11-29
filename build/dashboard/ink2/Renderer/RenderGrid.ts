import { Dimensions } from './RenderContainer';
import  { NodeInstance } from '../Tree';
import { Style, baseStyle } from '../Text/Style';
import RootNode from '../Tree/RootNode';
import GridRow from './GridRow';
import { RowRange } from './Coords';


export class RenderGrid implements Dimensions {

    public root: RootNode;
    public rows: GridRow[];
    public width: number;
    public height: number;
    public isLayoutDirty: boolean;
    private dirtyRows: Set<number>;

    public get isDirty(): boolean {
        return this.isLayoutDirty || !!this.dirtyRows.size;
    }

    public constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.root = new RootNode(width, height, this);
        this.dirtyRows = new Set();
        this.createRows();
    }

    private createRows() {
        this.rows = []; // discard existing any rows; when grid is resized, entire tree will need to be re(plotted|rendered)
        this.dirtyRows.clear(); // if we shrink num of rows, render could try to render a row which does not exist
        this.isLayoutDirty = true;
        for (let i = 0; i < this.height; i++) {
            this.rows.push(new GridRow(this, i));
            this.dirtyRows.add(i);
        }
    }

    public layout(): void {
        this.root.layout();
        for (let row, i = 0; row = this.rows[i]; i++) {
            this.root.renderContainer.plotRow(row);
        }
        this.isLayoutDirty = false;
    }

    public render(): void {
        if (this.isLayoutDirty) this.layout();
        for (let index of this.dirtyRows.values()) {
            this.rows[index].render();
        }
        this.dirtyRows.clear();
    }

    public renderToString(): string {
        this.render();
        const buff = [];
        for (let row, i = 0; row = this.rows[i]; i++) {
            buff.push(row.text);
        }
        return buff.join('');
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

    public markDirty(y: number): void {
        this.dirtyRows.add(y);
    }
    public markRangeDirty({ y0, y1 }: RowRange): void {
        for (let i = y0; i <= y1; i++) {
            this.dirtyRows.add(i);
        }
    }
    public markClean(y: number): void {
        this.dirtyRows.delete(y);
    }
    public markRangeClean({ y0, y1 }: RowRange): void {
        if (y0 === 0 && y1 === this.height) this.dirtyRows.clear();
        else {
            for (let i = y0; i <= y1; i++) {
                this.dirtyRows.delete(i);
            }
        }
    }
}
export default RenderGrid;
