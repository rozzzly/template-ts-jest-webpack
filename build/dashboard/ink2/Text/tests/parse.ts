import Chalk from 'chalk';
import { parseChunks } from '../parse';
import { TextWeight } from '../Style';
import { ColorPalette } from '../Style/palette';


describe('parsing text with ansi codes', () => {
    test('split\'s chunks with ansi codes into separate blocks', () => {
        const srcText = `some normal text ${Chalk.red('some red text')} some more normal text ${Chalk.bold('some bold text')}`;
        const parsed = parseChunks(srcText);

        expect(parsed.length).toBe(4);
        expect(parsed[0].text).toBe('some normal text ');
        expect(parsed[0].override).toEqual({ });
        expect(parsed[1].text).toBe('some red text');
        expect(parsed[1].override).toEqual({ fgColor: ColorPalette.red });
        expect(parsed[2].text).toBe(' some more normal text ');
        expect(parsed[2].override).toEqual({ fgColor: ColorPalette.default });
        expect(parsed[3].text).toBe('some bold text');
        expect(parsed[3].override).toEqual({ fgColor: ColorPalette.default, weight: TextWeight.bold });
    });
});
