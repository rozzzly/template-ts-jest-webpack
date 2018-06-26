import { sub } from './sub';

describe('sub(a: number, b: number): number', () => {
    it('can subtract two numbers', () => {
        expect(sub(0, 1)).toBe(-1);
        expect(sub(3, 1)).toBe(2);
        expect(sub(7, 1.1)).toBe(5.9);
    });
});