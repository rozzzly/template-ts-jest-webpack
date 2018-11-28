import * as stringWidth from 'string-width';
import RenderGrid from '../../Renderer/RenderGrid';
import GroupNode from '../GroupNode';
import TextNode from '../TextNode';
import Style from '../../Text/Style';
import { YogaAlignItems } from '../yoga/constants';
import RootNode from '../RootNode';
import { qSpan } from '../../Renderer/tests/__qCoords';


describe('a single GroupNode containing two TextNodes', () => {
    let grid: RenderGrid;
    let groupNode: GroupNode;
    let textNodeOne: TextNode;
    let textNodeTwo: TextNode;
    beforeEach(() => {
        grid = new RenderGrid(10, 4);
        groupNode = new GroupNode({}, {});
        textNodeOne = new TextNode('one');
        textNodeTwo = new TextNode('two');
        grid.root.appendChild(groupNode);
        groupNode.appendChild(textNodeOne);
        groupNode.appendChild(textNodeTwo);
    });


    describe('using defaultProps on the GroupNode ', () => {
        beforeEach(() => {
            grid.layout();
        });
        it('plots them side-by-side corner', () => {
            expect(grid.rows[0].spans).toEqual([
                qSpan(0, 3, textNodeOne, 0),
                qSpan(3, 6, textNodeTwo, 0),
                qSpan(6, 10, grid.root, 0)
            ]);
        });
        it('is not wider than it\'s children but uses all available height', () => {
            expect(grid.rows[1].spans).toEqual([
                qSpan(0, 6, groupNode, 1),
                qSpan(6, 10, grid.root, 1)
            ]);
            expect(grid.rows[2].spans).toEqual([
                qSpan(0, 6, groupNode, 2),
                qSpan(6, 10, grid.root, 2)
            ]);
            expect(grid.rows[3].spans).toEqual([
                qSpan(0, 6, groupNode, 3),
                qSpan(6, 10, grid.root, 3)
            ]);
        });
    });
});
