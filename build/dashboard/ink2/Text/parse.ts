import * as codes from './Style/AnsiCodes';
import { StyleOverride, baseStyleData, TextWeight } from './Style';
import { TextChunk } from './TextChunk';
import { Color } from './Style/Color';
import { sgrLookup } from './Style/palette';



const ansiStyleRegex: RegExp = /(\u001b\[(?:\d+;)*\d+m)/u;
export const ansiStyleParamsRegex: RegExp = /\u001b\[((?:\d+;)*\d+)m/u;

export const stripAnsiEscapes = (str: string): string => (
    str.split(ansiStyleRegex).reduce((reduction, part) => (
        ansiStyleRegex.test(part) ? reduction : reduction + part
    ), '')
);
export function normalize(raw: string): string {
    return raw.normalize('NFC');
}

export function parseChunks(normalized: string): TextChunk[] {
    const chunks: TextChunk[] = [];
    let style: StyleOverride = {};

    let escape: RegExpExecArray | null;
    const parts: string[] = normalized.split(ansiStyleRegex); // separate plaintext and escape sequences
    parts.forEach((part: string, index: number) => {
        if (part === '') return; // `return` is poor-man's continue (happens when ansi codes are leading/trailing/consecutive)
        else {
            if (escape = ansiStyleParamsRegex.exec(part)) { // SGR codes
                let params: number[] = escape[1].split(';').map(Number);
                while (params.length) {
                    let current: number = params.pop()!;
                    if (sgrLookup.fg[current]) {
                        style.fgColor = sgrLookup.fg[current];
                    } else if (sgrLookup.bg[current]) {
                        style.bgColor = sgrLookup.bg[current];
                    } else if (current === codes.FG_CUSTOM) {
                        const mode = params.pop();
                        if (mode === codes.COLOR_MODE_ANSI_256 && params.length >= 1) {
                            style.fgColor = Color.Ansi256(params.pop()!);
                        } else if (mode === codes.COLOR_MODE_RGB && params.length >= 3) {
                            style.fgColor = Color.RGB([
                                params.pop()!,
                                params.pop()!,
                                params.pop()!
                            ]);
                        } else {
                            throw new TypeError('Malformed custom text color');
                        }
                    } else if (current === codes.BG_CUSTOM) {
                        const mode = params.pop();
                        if (mode === codes.COLOR_MODE_ANSI_256 && params.length >= 1) {
                            style.bgColor = Color.Ansi256(params.pop()!);
                        } else if (mode === codes.COLOR_MODE_RGB && params.length >= 3) {
                            style.bgColor = Color.RGB([
                                params.pop()!,
                                params.pop()!,
                                params.pop()!
                            ]);
                        } else {
                            throw new TypeError('Malformed custom text color');
                        }
                    } else if (current === codes.WEIGHT_BOLD) {
                        style.weight = TextWeight.bold;
                    } else if (current === codes.WEIGHT_FAINT) {
                        style.weight = TextWeight.faint;
                    } else if (current === codes.WEIGHT_NORMAL) {
                        style.weight = TextWeight.normal;
                    } else if (current === codes.WEIGHT_BOLD_OFF && style.weight === TextWeight.bold) {
                        // wiki article says 'bold off' but doesn't specify if it disabled faint as well,
                        // so for now, don't do anything if current weight is not `bold`
                        style.weight = TextWeight.normal;
                    } else if (current === codes.ITALIC_ON) {
                        style.italic = true;
                    } else if (current === codes.ITALIC_OFF) {
                        style.italic = false;
                    } else if (current === codes.UNDERLINE_ON) {
                        style.underline = true;
                    } else if (current === codes.UNDERLINE_OFF) {
                        style.underline = false;
                    } else if (current === codes.INVERT_ON) {
                        style.inverted = true;
                    } else if (current === codes.INVERT_OFF) {
                        style.inverted = false;
                    } else if (current === codes.STRIKE_ON) {
                        style.strike = true;
                    } else if (current === codes.STRIKE_OFF) {
                        style.strike = false;
                    } else if (current === codes.RESET) {
                        style = { ...baseStyleData };
                    } else {
                        throw new TypeError(`Unsupported ANSI escape code SGR parameter: '${current}' in '${part}'.`);
                    }
                }
            } else {
                chunks.push(new TextChunk(part, style));
                style = { ... style }; // clone current OwnStyle for the next chunk
            }
        }
    });
    return chunks;
}
