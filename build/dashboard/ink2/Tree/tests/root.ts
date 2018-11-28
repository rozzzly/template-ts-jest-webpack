import RootNode from '../RootNode';
import RectCoords from '../../Renderer/Coords';
import { qRect } from '../../Renderer/tests/__qCoords';

describe('just a root node', () => {

    let root: RootNode;
    beforeEach(() => {
        root = new RootNode(100, 2);
    });

    it('creates it\'s own yoga node upon construction', () => {
        expect(root.yoga.node).toBeTruthy();
    });
    it('it has no parent', () => {
        expect(root.parent).toBeNull();
    });
    it('will calculate the layout when .layout() is called', () => {
        root = new RootNode(100, 2);
        expect(root.renderContainer.viewBox).toBeUndefined();
        expect(root.renderContainer.localCoords).toBeUndefined();
        expect(root.renderContainer.globalCoords).toBeUndefined();
        root.layout();
        const vBox = root.renderContainer.viewBox;
        const gCoords = root.renderContainer.globalCoords;
        const lCoords = root.renderContainer.globalCoords;
        expect(vBox).not.toBeNull();
        expect(vBox).toEqual(qRect(0, 100, 0, 2));
        expect(lCoords).toEqual(qRect(0, 100, 0, 2));
        expect(gCoords).toEqual(qRect(0, 100, 0, 2));
    });
});
