import * as stringWidth from 'string-width';
import RenderGrid from '../RenderGrid';
import TextNode from '../../Tree/TextNode';
import Style from '../../Text/Style';
import { ColorPalette } from '../../Text/Style/palette';

describe('a single (unclipped) text node without embedded Ansi styles', () => {
    const text = 'simple text';
    let grid: RenderGrid, textNode: TextNode;
    beforeEach(() => {
        grid = new RenderGrid(20, 2);
        textNode = new TextNode(text);
        grid.root.appendChild(textNode);
    });
    describe('without styles from it\'s parent', () => {
        describe('calling grid.layout() directly', () => {
            beforeEach(() => {
                grid.layout();
            });
            it('plots the correct number of spans', () => {
                expect(grid.rows.length).toBe(2);
                expect(grid.rows[0].spans.length).toBe(2);
                expect(grid.rows[1].spans.length).toBe(1);
            });
            it('plots the TextNode with the correct SpanCoords', () => {
                const textSpan = grid.rows[0].spans[0];
                expect(textSpan.node).toBe(textNode);
                expect(textSpan.x0).toBe(0);
                expect(textSpan.x1).toBe(11);
                expect(textSpan.y).toBe(0);
            });
            it('plots the RootNode to the rest of the GridRows', () => {
                const row0Span1 = grid.rows[0].spans[1];
                const row1Span0 = grid.rows[1].spans[0];
                expect(row0Span1.node).toBe(grid.root);
                expect(row0Span1.x0).toBe(11);
                expect(row0Span1.x1).toBe(20);
                expect(row0Span1.y).toBe(0);
                expect(row1Span0.node).toBe(grid.root);
                expect(row1Span0.x0).toBe(0);
                expect(row1Span0.x1).toBe(20);
                expect(row1Span0.y).toBe(1);
            });
        });
        it('renders the grid as expected', () => {
            const rendered = grid.renderToString();
            const expected = [
                text,
                ' '.repeat(20 - stringWidth(text)),
                Style.resetCode,
                '\r\n',
                ' '.repeat(20),
                Style.resetCode,
                '\r\n'
            ].join('');
            expect(rendered).toBe(expected);
        });
    });
    describe('with RootNode having the bgColor set to blue', () => {
        beforeEach(() => {
            grid.root.setStyle({ bgColor: ColorPalette.blue });
        });
        it('renders the grid as expected', () => {
            const rendered = grid.renderToString();
            const expected = [
                Style.code({ bgColor: ColorPalette.blue }),
                text,
                ' '.repeat(20 - stringWidth(text)),
                Style.resetCode,
                '\r\n',
                Style.code({ bgColor: ColorPalette.blue }),
                ' '.repeat(20),
                Style.resetCode,
                '\r\n'
            ].join('');
            expect(rendered).toBe(expected);
        });
        describe('with TextNode having a fgColor of red', () => {
            beforeEach(() => {
                textNode.setStyle({ fgColor: ColorPalette.red });
            });
            it('renders the grid as expected', () => {
                const rendered = grid.renderToString();
                const expected = [
                    Style.code({ fgColor: ColorPalette.red, bgColor: ColorPalette.blue }),
                    text,
                    Style.code({ fgColor: ColorPalette.default }),
                    ' '.repeat(20 - stringWidth(text)),
                    Style.resetCode,
                    '\r\n',
                    Style.code({ bgColor: ColorPalette.blue }),
                    ' '.repeat(20),
                    Style.resetCode,
                    '\r\n'
                ].join('');
                expect(rendered).toBe(expected);
            });
        });
    });
    describe('with TextNode having a fgColor of red', () => {
        beforeEach(() => {
            textNode.setStyle({ fgColor: ColorPalette.red });
        });
        it('renders the grid as expected', () => {
            const rendered = grid.renderToString();
            const expected = [
                Style.code({ fgColor: ColorPalette.red }),
                text,
                Style.code({ fgColor: ColorPalette.default }),
                ' '.repeat(20 - stringWidth(text)),
                Style.resetCode,
                '\r\n',
                ' '.repeat(20),
                Style.resetCode,
                '\r\n'
            ].join('');
            expect(rendered).toBe(expected);
        });
    });
});
