import * as stringWidth from 'string-width';
import RenderGrid from '../RenderGrid';
import TextNode from '../../Tree/TextNode';
import Style from '../../Text/Style';
import ColorPalette from '../../Text/Style/palette';
import { qSpan, qRect, rowSpans } from './__qCoords';

describe('a single (unclipped) text node without embedded Ansi styles', () => {
    const text = 'simple text';
    const textWidth = stringWidth(text);
    let grid: RenderGrid, textNode: TextNode;
    beforeEach(() => {
        grid = new RenderGrid(20, 2);
        textNode = new TextNode(text);
        grid.root.appendChild(textNode);
    });
    describe('without styles from it\'s parent', () => {
        beforeEach(() => grid.render());
        it('correctly plots all spans correctly', () => {
            expect(rowSpans(grid)).toEqual([
                [
                    qSpan(0, textWidth, textNode, 0),
                    qSpan(textWidth, 20, grid.root, 0)
                ], [
                    qSpan(0, 20, grid.root, 1)
                ]
            ]);
        });
        it('renders the grid as expected', () => {
            expect(grid.rows[0].text).toBe(grid.rows[0].getBuilder()
                .text(text, textWidth)
                .gap(grid.width - textWidth)
                .toString()
            );
            expect(grid.rows[1].text).toBe(grid.rows[1].getBuilder()
                .gap(grid.width)
                .toString()
            );
        });
    });
    describe('with RootNode having the bgColor set to blue', () => {
        beforeEach(() => {
            grid.root.setStyle({ bgColor: ColorPalette.blue });
        });
        it('renders the grid as expected', () => {
            grid.render();
            expect(grid.rows[0].text).toBe(
                grid.rows[0].getBuilder()
                .styledText({ bgColor: ColorPalette.blue }, text, textWidth)
                .gap(grid.width - textWidth)
                .toString()
            );
            expect(grid.rows[1].text).toBe(
                grid.rows[1].getBuilder()
                .styledGap({ bgColor: ColorPalette.blue }, grid.width)
                .toString()
            );
        });
        describe('with TextNode having a fgColor of red', () => {
            beforeEach(() => {
                textNode.setStyle({ fgColor: ColorPalette.red });
            });
            it('renders the grid as expected', () => {
                grid.render();
                expect(grid.rows[0].text).toBe(
                    grid.rows[0].getBuilder()
                    .styledText({ bgColor: ColorPalette.blue, fgColor: ColorPalette.red }, text, textWidth)
                    .styledGap({ bgColor: ColorPalette.blue }, grid.width - textWidth)
                    .toString()
                );
                expect(grid.rows[1].text).toBe(
                    grid.rows[1].getBuilder()
                    .styledGap({ bgColor: ColorPalette.blue }, grid.width)
                    .toString()
                );
            });
        });
    });
    describe('with TextNode having a fgColor of red', () => {
        beforeEach(() => {
            textNode.setStyle({ fgColor: ColorPalette.red });
        });
        it('renders the grid as expected', () => {
            grid.render();
            expect(grid.rows[0].text).toBe(
                grid.rows[0].getBuilder()
                .styledText({ fgColor: ColorPalette.red }, text, textWidth)
                .styledGap({}, grid.width - textWidth)
                .toString()
            );
            expect(grid.rows[1].text).toBe(
                grid.rows[1].getBuilder()
                .gap(grid.width)
                .toString()
            );
        });
    });
});
