import { parseChunks } from '../parse';
import { TextBlockLine } from '../TextBlock';
import { baseStyle } from '../TextStyle/TextStyle';

describe('clipping text', () => {
    describe('unstyled text', () => {
        let line: TextBlockLine;
        beforeEach(() => {
            const chunks = parseChunks('0123456789');
            // expect(chunks.length).toBe(1);

            line = new TextBlockLine();
            line.append(chunks[0]);
            line.computeStyle(baseStyle);

        });
        describe('within bounds', () => {
            test('excess room (on right)', () => {
                const rendered = line.render(0, 15, baseStyle);
                expect(rendered.text).toBe('0123456789');
            });
            test('exact fit', () => {
                const rendered = line.render(0, 10, baseStyle);
                expect(rendered.text).toBe('0123456789');
            });
        });
        describe('clip left', () => {
            test('excess room (on right)', () => {
                const rendered = line.render(-2, 15, baseStyle);
                expect(rendered.text).toBe('23456789');
            });
            test('exact fit', () => {
                const rendered = line.render(-2, 8, baseStyle);
                expect(rendered.text).toBe('23456789');
            });
        });
    });
});
