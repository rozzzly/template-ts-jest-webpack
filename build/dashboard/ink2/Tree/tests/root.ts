import RootNode from '../RootNode';

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
        expect(root.renderContainer.viewBox).toBeUndefined();
        expect(root.renderContainer.localCoords).toBeUndefined();
        expect(root.renderContainer.globalCoords).toBeUndefined();
        root.layout();
        const vBox = root.renderContainer.viewBox;
        const gCoords = root.renderContainer.globalCoords;
        const lCoords = root.renderContainer.globalCoords;
        expect(vBox).not.toBeNull();
        expect(vBox!.x0).toBe(0);
        expect(vBox!.x1).toBe(100);
        expect(vBox!.y0).toBe(0);
        expect(vBox!.y1).toBe(2);
        expect(gCoords.x0).toBe(0);
        expect(gCoords.x1).toBe(100);
        expect(gCoords.y0).toBe(0);
        expect(gCoords.y1).toBe(2);
        expect(lCoords.x0).toBe(0);
        expect(lCoords.x1).toBe(100);
        expect(lCoords.y0).toBe(0);
        expect(lCoords.y1).toBe(2);
    });


});
