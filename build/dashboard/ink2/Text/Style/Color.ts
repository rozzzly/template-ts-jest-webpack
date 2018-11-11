// @see https://github.com/rozzzly/string-ast/blob/master/src/Ansi/AnsiColor.ts
import * as convert from 'color-convert';
import * as htmlColorNames from 'color-name';
import * as codes  from './AnsiCodes';
import { inRange, literalsEnum, ExtractLiterals } from '../../misc';
import { composeCode } from './AnsiCodes';
import { ColorPalette } from './palette';

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


export const ColorMode = literalsEnum('Ansi16', 'Ansi256', 'rgb');
export type ColorMode = ExtractLiterals<typeof ColorMode>;

/// TODO ::: graceful fallback (eg: rgb is unsupported -> ansi256)


const HexRegex = /[a-f0-9]{6}|[a-f0-9]{3}/;

export class Color {

    public mode: ColorMode | null;
    public value: RGBTuple | number | 'default';

    public static fromString(str: string): Color | null {
        const lower = str.toLowerCase();
        let match: RegExpExecArray | null;
        // @ts-ignore
        if (htmlColorNames[lower]) {
            // @ts-ignore
            return Color.RGB(htmlColorNames[lower]);
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
            return Color.RGB([
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

    public static RGB(value: RGBTuple): Color {
        if (isRGBTuple(value)) {
            return new Color(value, ColorMode.rgb);
        } else {
            throw new Error('Invalid RGB value');
        }
    }

    public static Ansi256(value: number): Color {
        if (inRange(0, 255, value)) {
            return new Color(value, ColorMode.Ansi256);
        } else {
            throw new Error('Invalid Ansi256 value.');
        }
    }

    public static Ansi16(value: number): Color {
        if (inRange(0, 15, value)) {
            // accept 0-based Ansi16 palette
            return new Color(value, ColorMode.Ansi16);
        } else {
            // color from an SRG param shifted to 0-based Ansi16
            if (inRange(codes.FG_START, codes.FG_END, value)) {
                return new Color(value - codes.FG_START, ColorMode.Ansi16);
            } else if (inRange(codes.FG_BRIGHT_START, codes.FG_BRIGHT_END, value)) {
                return new Color(value - codes.FG_BRIGHT_START + 8, ColorMode.Ansi16);
            } else  if (inRange(codes.BG_START, codes.BG_END, value)) {
                return new Color(value - codes.BG_START, ColorMode.Ansi16);
            } else if (inRange(codes.BG_BRIGHT_START, codes.BG_BRIGHT_END, value)) {
                return new Color(value - codes.BG_BRIGHT_START + 8, ColorMode.Ansi16);
            } else if (value === codes.FG_CUSTOM || value === codes.BG_CUSTOM) {
                return ColorPalette.default;
            } else {
                throw new Error('Invalid Ansi16 value.');
            }
        }
    }

    public static default(): Color {
        return new Color('default', null);
    }

    private constructor(value: 'default' | number | RGBTuple, mode: ColorMode | null) {
        this.value = value;
        this.mode = mode;
    }

    public fgCode(): string;
    public fgCode(full: true): string;
    public fgCode(full: false): number[];
    public fgCode(full: boolean): string | number[];
    public fgCode(full: boolean = true): string | number[] {
        if (full) {
            return composeCode(this.fgCode(false));
        } else {
            if (this.mode === ColorMode.rgb) {
                return [codes.FG_CUSTOM, codes.COLOR_MODE_RGB, ...(this.value as RGBTuple)];
            } else if (this.mode === ColorMode.Ansi256) {
                return [codes.FG_CUSTOM, codes.COLOR_MODE_ANSI_256, this.value as number];
            } else if (this.mode === ColorMode.Ansi16) {
                if ((this.value as number) < 8) {
                    return [codes.FG_START + (this.value as number)];
                } else {
                    return [codes.FG_BRIGHT_START + (this.value as number)];
                }
            } else {
                return [codes.FG_DEFAULT];
            }
        }
    }
    public bgCode(): string;
    public bgCode(full: true): string;
    public bgCode(full: false): number[];
    public bgCode(full: boolean): string | number[];
    public bgCode(full: boolean = true): string | number[] {
        if (full) {
            return composeCode(this.bgCode(false));
        } else {
            if (this.mode === ColorMode.rgb) {
                return [codes.BG_CUSTOM, codes.COLOR_MODE_RGB, ...(this.value as RGBTuple)];
            } else if (this.mode === ColorMode.Ansi256) {
                return [codes.BG_CUSTOM, codes.COLOR_MODE_ANSI_256, this.value as number];
            } else if (this.mode === ColorMode.Ansi16) {
                if ((this.value as number) < 8) {
                    return [codes.BG_START + (this.value as number)];
                } else {
                    return [codes.BG_BRIGHT_START + (this.value as number)];
                }
            } else {
                return [codes.BG_DEFAULT];
            }
        }
    }

    public equalTo(other: Color): boolean {
        if (this === other) return true; // quick test for referential equality (eg used predefined consts)
        const selfIsDefault = this.value === 'default';
        const otherIsDefault = other.value === 'default';

        if (selfIsDefault && otherIsDefault) {
            return true;
        } else if (selfIsDefault || otherIsDefault) {
            return false;
        } else {
            const selfIs256 = this.mode === ColorMode.Ansi256;
            const selfIsRGB = this.mode === ColorMode.rgb;
            const otherIs256 = other.mode === ColorMode.Ansi256;
            const otherIsRGB = other.mode === ColorMode.rgb;
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
