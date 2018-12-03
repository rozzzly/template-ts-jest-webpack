import * as stringWidth from 'string-width';
import RenderGrid from '../../../Renderer/RenderGrid';
import GroupNode from '../../GroupNode';
import TextNode from '../../TextNode';
import Style from '../../../Text/Style';
import ColorPalette from '../../../Text/Style/palette';
import { YogaAlignItems, YogaAlignItemsValues } from '../constants';
import { qSpan } from '../../../Renderer/tests/__qCoords';

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
        textNode.setOverride({ fgColor: ColorPalette.green });
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
                expect(row.text).toBe(
                    row.getBuilder()
                    .styledText(new Style({ fgColor: ColorPalette.green, bgColor: ColorPalette.red }), text)
                    .styledGap(Style.base, grid.width - textWidth)
                    .toString()
                );
            } else {
                expect(row.text).toBe(
                    row.getBuilder()
                    .styledGap(new Style({ bgColor: ColorPalette.red }), textWidth)
                    .styledGap(Style.base, grid.width - textWidth)
                    .toString()
                );
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
            renderMacro(0, 0);
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
            renderMacro(0, 0);
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
            renderMacro(0, 3);
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
            renderMacro(0, 2);
        });
    });

});
