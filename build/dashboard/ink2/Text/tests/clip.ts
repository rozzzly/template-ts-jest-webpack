import Chalk from 'chalk';
import { parseChunks } from '../parse';
import { TextBlockLine } from '../TextBlock';
import { baseStyle, ComputedTextStyle } from '../TextStyle/TextStyle';
import { ColorPalette } from '../TextStyle/ColorPalette';

describe('clipping text', () => {
    describe('styled text (three chunks)', () => {

        const codes = {
            red: ComputedTextStyle.code({
                fgColor: ColorPalette.red
            }),
            redItalic: ComputedTextStyle.code({
                fgColor: ColorPalette.red,
                italic: true
            }),
            italic: ComputedTextStyle.code({
                italic: true
            }),
            defaultFg: ComputedTextStyle.code({
                fgColor: ColorPalette.default
            }),
            nonItalic: ComputedTextStyle.code({
                italic: false
            }),
        };

        let line: TextBlockLine;
        beforeEach(() => {
            const chunks = parseChunks(`${Chalk.italic(`${Chalk.red('xyz')}0123456789`)}abcdef`); /// 3 + 10 + 6 = 19
            line = new TextBlockLine();
            line.append(chunks[0]);
            line.append(chunks[1]);
            line.append(chunks[2]);
            line.computeStyle(baseStyle);

        });

        const macro = (skip: number, width: number): string => (
            line.render(skip, width, baseStyle).text
        );

        test('styled line', () => {
            expect(line.chunks.length).toBe(3);
        });

        describe('clip left', () => {
            test('clip inside second chunk', () => {
                expect(macro(4, 15)).toBe(`${codes.italic}123456789${codes.nonItalic}abcdef`);
            });
            test('clip between first and second chunks', () => {
                expect(macro(3, 16)).toBe(`${codes.italic}0123456789${codes.nonItalic}abcdef`);
            });
            test('clip inside first chunk', () => {
                expect(macro(2, 17)).toBe(`${codes.redItalic}z${codes.defaultFg}0123456789${codes.nonItalic}abcdef`);
            });
        });
    });

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
