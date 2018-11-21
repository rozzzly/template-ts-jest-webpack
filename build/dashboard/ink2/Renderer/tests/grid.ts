import RootNode from '../../Tree/RootNode';
import RenderGrid from '../RenderGrid';

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
                expect(grid.rows[0].spans.length).toBe(1);
                expect(grid.rows[0].spans[0].x0).toBe(0);
                expect(grid.rows[0].spans[0].x1).toBe(20);
                expect(grid.rows[0].spans[0].node).toBe(grid.root);
                expect(grid.rows[0].y).toBe(0);
                expect(grid.rows[1].spans.length).toBe(1);
                expect(grid.rows[1].spans[0].x0).toBe(0);
                expect(grid.rows[1].spans[0].x1).toBe(20);
                expect(grid.rows[1].spans[0].node).toBe(grid.root);
                expect(grid.rows[1].y).toBe(1);
            });
            it('will still be dirty because rows have yet to be rendered', () => {
                expect(grid.isDirty).toBe(true);
            });
        });
    });
});
