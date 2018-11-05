// @see https://github.com/rozzzly/string-ast/blob/master/src/Ansi/AnsiColor.ts
import * as convert from 'color-convert';
import * as htmlColorNames from 'color-name';
import * as codes  from './AnsiCodes';
import { inRange, literalsEnum, ExtractLiterals } from '../../misc';
import { ColorPalette } from './ColorPalette';

export type RGB = (
    | RGBTuple
    | RGBObject
);

export interface RGBObject {
    r: number;
    g: number;
    b: number;
}

export type RGBTuple = [ number, number, number ];

export const isRGBTuple = (value: unknown): value is RGBTuple => (
    Array.isArray(value) &&
    value.length === 3 &&
    value.every(v => typeof v === 'number' && inRange(0, 255, v))
);

export const compareRGBTuple = (left: RGBTuple, right: RGBTuple): boolean => (
    left[0] === right[0] &&
    left[1] === right[1] &&
    left[2] === right[2]
);


export const TextColorMode = literalsEnum('Ansi16', 'Ansi256', 'rgb');
export type TextColorMode = ExtractLiterals<typeof TextColorMode>;

/// TODO ::: graceful fallback


const HexRegex = /[a-f0-9]{6}|[a-f0-9]{3}/;

export class TextColor {
    public mode: TextColorMode | null;
    public value: RGBTuple | number | 'default';

    public static fromString(str: string): TextColor | null {
        const lower = str.toLowerCase();
        let match: RegExpExecArray | null;
        // @ts-ignore
        if (htmlColorNames[lower]) {
            // @ts-ignore
            return new TextColor(htmlColorNames[lower]);
        } else if (match = HexRegex.exec(str)) {
            const fullHex = ((match[0].length === 6)
                ? match[0]
                : (
                    match[0][0] + match[0][0] +
                    match[0][1] + match[0][1] +
                    match[0][2] + match[0][2]
                )
            );
            const dec = parseInt(fullHex, 16);
            return new TextColor([
                (dec >> 16) & 0xff,
                (dec >> 8) & 0xff,
                dec & 0xff
            ]);
        } else if (lower === 'default') {
            return ColorPalette.default;
        } else {
            return null;
        }
    }

    public constructor(value: RGB);
    public constructor(value: 'default');
    public constructor(value: number, mode: Exclude<TextColorMode, 'rgb'>);
    public constructor(value: RGB | number | 'default', mode: TextColorMode | null = null) {
        if (value === 'default') {
            this.value = value;
            this.mode = null;
        } else if (typeof value === 'number') {
            if (mode === TextColorMode.Ansi16) {
                this.mode = TextColorMode.Ansi16;
                if (inRange(0, 15, value)) {
                    // accept 0-based Ansi16 palette
                    this.value = value;
                } else {
                    // color from an SRG param shifted to 0-based Ansi16
                    if (inRange(codes.FG_START, codes.FG_END, value)) {
                        this.value = value - codes.FG_START;
                    } else if (inRange(codes.FG_BRIGHT_START, codes.FG_BRIGHT_END, value)) {
                        this.value = (value - codes.FG_BRIGHT_START) + 8;
                    } else  if (inRange(codes.BG_START, codes.BG_END, value)) {
                        this.value = value - codes.BG_START;
                    } else if (inRange(codes.BG_BRIGHT_START, codes.BG_BRIGHT_END, value)) {
                        this.value = (value - codes.BG_BRIGHT_START) + 8;
                    } else if (value === codes.FG_CUSTOM || value === codes.BG_CUSTOM) {
                        this.value = 'default';
                        this.mode = null;
                    } else {
                        throw new Error('Invalid Ansi16 value.');
                    }
                }
            } else if (mode === TextColorMode.Ansi256 && inRange(0, 255, value)) {
                this.value = value;
                this.mode = TextColorMode.Ansi256;
            } else {
                throw new Error('Numeric values must specify Ansi16 / Ansi256 and be in range of their palette (or an corresponding SRG code if Ansi16).');
            }
        } else if (typeof value === 'object') {
            this.mode = TextColorMode.rgb;
            if (isRGBTuple(value)) {
                this.value = value;
            } else {
                const coerced = [value.r, value.g, value.b];
                if (isRGBTuple(coerced)) {
                    this.value = coerced;
                } else {
                    throw new Error('Malformed RGB');
                }
            }
        } else {
            throw new Error('Unexpected call signature');
        }

    }

    public fgCode(): string {
        let params: number[];
        if (this.mode === TextColorMode.rgb) {
            params = [codes.FG_CUSTOM, codes.COLOR_MODE_RGB, ...(this.value as RGBTuple)];
        } else if (this.mode === TextColorMode.Ansi256) {
            params = [codes.FG_CUSTOM, codes.COLOR_MODE_ANSI_256, this.value as number];
        } else if (this.mode === TextColorMode.Ansi16) {
            if ((this.value as number) < 8) {
                params = [codes.FG_START + (this.value as number)];
            } else {
                params = [codes.FG_BRIGHT_START + (this.value as number)];
            }
        } else {
            params = [codes.FG_DEFAULT];
        }
        return `\u001b[${params.join(';')}m`;
    }
    public bgCode(): string {
        let params: number[];
        if (this.mode === TextColorMode.rgb) {
            params = [codes.BG_CUSTOM, codes.COLOR_MODE_RGB, ...(this.value as RGBTuple)];
        } else if (this.mode === TextColorMode.Ansi256) {
            params = [codes.BG_CUSTOM, codes.COLOR_MODE_ANSI_256, this.value as number];
        } else if (this.mode === TextColorMode.Ansi16) {
            if ((this.value as number) < 8) {
                params = [codes.BG_START + (this.value as number)];
            } else {
                params = [codes.BG_BRIGHT_START + (this.value as number)];
            }
        } else {
            params = [codes.BG_DEFAULT];
        }
        return `\u001b[${params.join(';')}m`;
    }

    public equalTo(other: TextColor): boolean {
        if (this === other) return true; // quick test for referential equality (eg used predefined consts)
        const selfIsDefault = this.value === 'default';
        const otherIsDefault = other.value === 'default';

        if (selfIsDefault && otherIsDefault) {
            return true;
        } else if (selfIsDefault || otherIsDefault) {
            return false;
        } else {
            const selfIs256 = this.mode === TextColorMode.Ansi256;
            const selfIsRGB = this.mode === TextColorMode.rgb;
            const otherIs256 = other.mode === TextColorMode.Ansi256;
            const otherIsRGB = other.mode === TextColorMode.rgb;
            if (selfIsRGB || otherIsRGB) {
                if (selfIsRGB && otherIsRGB) {
                    return compareRGBTuple(this.value as RGBTuple, other.value as RGBTuple);
                } else {
                    // Can't test for true equality between RGB and Ansi16 (or first 16 colors in Ansi256)
                    // because they're implementation specific (different terms use different RGBs)
                    if (selfIs256 && this.value >= 16) {
                        return compareRGBTuple(
                            convert.ansi256.rgb(this.value as number),
                            other.value as RGBTuple
                        );
                    } else if (otherIs256 && other.value >= 16) {
                        return compareRGBTuple(
                            this.value as RGBTuple,
                            convert.ansi256.rgb(other.value as number)
                        );
                    } else {
                        return false;
                    }
                }
            } else {
                // it's safe to compare Ansi16 and Ansi256 because Ansi256 is a super-set of Ansi16
                // and their indexes line up 1-to-1
                return this.value === other.value;
            }
        }
    }
}

export type ColorValue = (
    | TextColor
    | RGB
    | number
    | string
);
