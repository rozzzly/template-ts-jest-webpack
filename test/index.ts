const add = (a: number, b: number): number => a + b;

describe('add(a: number, b: number): number', () => {
    it('can add two numbers', () => {
        expect(add(0, 1)).toBe(1);
        expect(add(3, 1)).toBe(4);
        expect(add(7, 1.1)).toBe(8.1);
    });
});