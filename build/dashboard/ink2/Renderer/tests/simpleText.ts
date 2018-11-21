import RenderGrid from '../RenderGrid';
import TextNode from '../../Tree/TextNode';

describe('a single (unclipped) text node without embedded Ansi styles', () => {
    describe('without styles from it\'s parent', () => {
        let grid: RenderGrid, textNode: TextNode;
        beforeEach(() => {
            grid = new RenderGrid(20, 2);
            textNode = new TextNode('simple text');
            grid.root.appendChild(textNode);
        });
        describe('calling grid.layout() directly', () => {
            beforeEach(() => grid.layout());

            it('plots the TextNode with the correct SpanCoords', () => {
                expect(grid.rows[0].spans.length).toBe(2);
                const textSpan = grid.rows[0].spans[0];
                expect(textSpan.node).toBe(textNode);
                expect(textSpan.x0).toBe(0);
                expect(textSpan.x1).toBe(11);
                expect(textSpan.y).toBe(0);
            });
        });
    });
});
