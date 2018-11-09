import { parseChunks } from '../parse';
import { TextBlockLine } from '../TextBlock';
import { baseStyle } from '../TextStyle/TextStyle';

describe('clipping text', () => {
    describe('unstyled text (single chunk)', () => {
        let line: TextBlockLine;
        beforeEach(() => {
            const chunks = parseChunks('0123456789');
            // expect(chunks.length).toBe(1);

            line = new TextBlockLine();
            line.append(chunks[0]);
            line.computeStyle(baseStyle);

        });

        const macro = (skip: number, width: number): string => (
            line.render(skip, width, baseStyle).text
        );

        describe('within bounds', () => {
            test('excess room (on both sides)', () => {
                expect(macro(-2, 14)).toBe('0123456789');
            });
            test('excess room (on left)', () => {
                expect(macro(-2, 12)).toBe('0123456789');
            });
            test('excess room (on right)', () => {
                expect(macro(0, 12)).toBe('0123456789');
            });
            test('exact fit', () => {
                expect(macro(0, 10)).toBe('0123456789');
            });
        });
        describe('clip left', () => {
            test('excess right', () => {
                expect(macro(2, 10)).toBe('23456789');
            });
            test('flush right', () => {
                expect(macro(2, 8)).toBe('23456789');
            });
        });
        describe('clip right', () => {
            test('excess right', () => {
                expect(macro(-2, 10)).toBe('01234567');
            });
            test('flush right', () => {
                expect(macro(0, 8)).toBe('01234567');
            });
        });
        test('clip both', () => {
            expect(macro(2, 6)).toBe('234567');
        });
    });
});
