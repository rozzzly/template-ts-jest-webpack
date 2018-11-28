import * as stringWidth from 'string-width';
import RenderGrid from '../../../Renderer/RenderGrid';
import GroupNode from '../../GroupNode';
import TextNode from '../../TextNode';
import Style from '../../../Text/Style';
import { YogaAlignItems, YogaAlignItemsValues } from '../constants';
import RectCoords from '../../../Renderer/Coords';
import { qSpan } from '../../../Renderer/tests/__qCoords';
import { number } from 'prop-types';
import { ColorPalette } from '../../../Text/Style/palette';

describe('a single GroupNode containing a simple TextNode', () => {
    const text = 'some simple text';
    const textWidth = stringWidth(text);
    let grid: RenderGrid;
    let groupNode: GroupNode;
    let textNode: TextNode;
    beforeEach(() => {
        grid = new RenderGrid(20, 4);
        groupNode = new GroupNode({}, { bgColor: ColorPalette.red });
        textNode = new TextNode(text);
        textNode.setStyle({ fgColor: ColorPalette.green });
        grid.root.appendChild(groupNode);
        groupNode.appendChild(textNode);
    });
    const plotMacro = (xOffset: number, yOffset: number): void => {
        expect(grid.rows.length).toBe(4);
        for (let row, y = 0; row = grid.rows[y]; y++) {
            if (y === yOffset) {
                if (xOffset === 0) {
                    expect(row.spans.length).toBe(2);
                    expect(row.spans).toEqual([
                        qSpan(0, textWidth, textNode, y),
                        qSpan(textWidth, grid.width, grid.root, y)
                    ]);
                } else if (xOffset + textWidth < 20) {
                    expect(row.spans.length).toBe(3);
                    expect(row.spans).toEqual([
                        qSpan(0, xOffset, groupNode, y),
                        qSpan(xOffset, xOffset + textWidth, textNode, y),
                        qSpan(xOffset + textWidth, grid.width, groupNode, y)
                    ]);
                } else {
                    expect(row.spans.length).toBe(2);
                    expect(row.spans).toEqual([
                        qSpan(0, xOffset, groupNode, y),
                        qSpan(xOffset, grid.width, textNode, y)
                    ]);
                }
            } else {
                expect(row.spans.length).toBe(2);
                expect(row.spans).toEqual([
                    qSpan(0, textWidth, groupNode, y),
                    qSpan(textWidth, grid.width, grid.root, y)
                ]);
            }
        }
    };
    const renderMacro = (xOffset: number, yOffset: number): void => {
        for (let row, y = 0; row = grid.rows[y]; y++ ) {
            if (y === yOffset) {
                const built = ((row.getBuilder())
                    .styledText(new Style({ fgColor: ColorPalette.red, bgColor: ColorPalette.blue }), text),
                    .styledText()
                );
                expect(row.text).toBe(text + ' '.repeat(grid.width - textWidth) + Style.resetCode + '\r\n');
            } else {
                expect(
            }
        }
    };
    it('alignItems defaults to stretch', () => {
        expect(groupNode.yoga.staged.alignItems).toBe(YogaAlignItemsValues.stretch);
    });
    describe('alignItems = stretch', () => {
        it('correctly plots all nodes', () => {
            grid.layout();
            plotMacro(0, 0);
        });
        it('correctly renders all rows', () => {
            grid.render();
            expect(grid.rows[0].text).toBe(text + ' '.repeat(grid.width - textWidth) + Style.resetCode + '\r\n');
            expect(grid.rows[1].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[2].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[3].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
        });
    });
    describe('alignItems = flexStart', () => {
        beforeEach(() => {
            groupNode.yoga.setProps({
                alignItems: YogaAlignItems.flexStart
            });
        });
        it('correctly plots all nodes', () => {
            grid.layout();
            plotMacro(0, 0);
        });
        it('correctly renders all rows', () => {
            grid.render();

            expect(grid.rows[1].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[2].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[3].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
        });
    });
    describe('alignItems = flexEnd', () => {
        beforeEach(() => {
            groupNode.yoga.mergeProps({
                alignItems: YogaAlignItems.flexEnd
            });
        });
        it('correctly plots all nodes', () => {
            grid.layout();
            plotMacro(0, 3);
        });
        it('correctly renders all rows', () => {
            grid.render();
            expect(grid.rows[0].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[1].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[2].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[3].text).toBe(text + ' '.repeat(grid.width - textWidth) + Style.resetCode + '\r\n');
        });
    });
    describe('alignItems = center', () => {
        beforeEach(() => {
            groupNode.yoga.mergeProps({
                alignItems: YogaAlignItems.center
            });
        });
        it('correctly plots all nodes', () => {
            grid.layout();
            plotMacro(0, 2);
        });
        it('correctly renders all rows', () => {
            grid.render();
            expect(grid.rows[0].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[1].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
            expect(grid.rows[2].text).toBe(text + ' '.repeat(grid.width - textWidth) + Style.resetCode + '\r\n');
            expect(grid.rows[3].text).toBe(' '.repeat(grid.width) + Style.resetCode + '\r\n');
        });
    });

});
