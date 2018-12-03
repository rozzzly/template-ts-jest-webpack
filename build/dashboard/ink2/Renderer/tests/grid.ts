import RootNode from '../../Tree/RootNode';
import RenderGrid from '../RenderGrid';
import { qSpan, rowSpans } from './__qCoords';

describe('grid', () => {
    it('is dirty upon creation', () => {
        const grid = new RenderGrid(20, 4);
        expect(grid.isDirty).toBe(true);
    });
    it('creates it\'s own RootNode', () => {
        const grid = new RenderGrid(20, 4);
        expect(grid.root).toBeInstanceOf(RootNode);
    });
    describe('empty root', () => {
        let grid: RenderGrid;
        beforeEach(() => {
             grid = new RenderGrid(20, 2);
        });
        describe('calling grid.layout() directly', () => {
            beforeEach(() => {
                grid.layout();
            });
            it('plots out both rows, belonging to just the root', () => {
                expect(grid.rows.length).toBe(2);
                expect(rowSpans(grid)).toEqual([[
                    qSpan(0, 20, grid.root, 0)
                ], [
                    qSpan(0, 20, grid.root, 1)
                ]]);
            });
            it('will still be dirty because rows have yet to be rendered', () => {
                expect(grid.isDirty).toBe(true);
            });
        });
    });
});
