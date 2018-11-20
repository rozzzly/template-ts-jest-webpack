import RootNode from '../../Tree/RootNode';
import RenderGrid from '../RenderGrid';

describe('grid', () => {
    it('is dirty upon creation', () => {
        const grid = new RenderGrid(100, 2);
        expect(grid.isDirty).toBe(true);
    });
    it('creates it\'s own RootNode', () => {
        const grid = new RenderGrid(100, 200);
        expect(grid.root).toBeInstanceOf(RootNode);
    });
    describe('empty root', () => {
        it('plots the root onto both rows', () => {
            const grid = new RenderGrid(100, 2);
            grid.root.layout();
            grid.plotRows();
            expect(grid.rows.length).toBe(2);
            expect(grid.rows[0].spans.length).toBe(1);
            expect(grid.rows[0].spans[0].node).toBe(grid.root);
            expect(grid.rows[1].rowIndex).toBe(1);

        });
    });
});
