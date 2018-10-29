// @see https://github.com/rozzzly/string-ast/blob/master/src/Ansi/AnsiColor.ts
import { isEqual } from 'lodash';
import * as codes  from './AnsiCodes';
import { inRange, literalsEnum, ExtractLiterals } from '../misc';

export type RGB = (
    | RGBObject
    | RGBTuple
);

export interface RGBObject {
    r: number;
    g: number;
    b: number;
}

export type RGBTuple = [ number, number, number ];

const ansiColorMode = literalsEnum('Ansi16', 'Ansi256', 'rgb');
export type AnsiColorMode = ExtractLiterals<typeof ansiColorMode>;

export class AnsiColor {
    public mode: AnsiColorMode;
    public value: RGBObject | number | 'default';

    public constructor(value: RGB);
    public constructor(value: 'default');
    public constructor(value: RGB | number | 'default', mode: AnsiColorMode);
    public constructor(value: RGB | number | 'default', mode: AnsiColorMode = undefined as any) {
        if (value === 'default') {
            if (mode && mode !== ansiColorMode.Ansi16) {
                throw new Error('The `default` value is only part of Ansi16 colorspace.');
            } else {
                this.value = value;
                this.mode = ansiColorMode.Ansi16;
            }
        } else if (typeof value === 'number') {
            if (!mode) {
                throw new Error('Numeric values must specify if Ansi16 Or Ansi256 colorspace.');
            } else {
                this.value = value;
                this.mode = mode;
            }
        } else if (typeof value === 'object') {
            if (mode && mode !== ansiColorMode.rgb) {
                throw new Error('An rgb value is only part of rgb colorspace.');
            } else {
                this.mode = ansiColorMode.rgb;
                if (Array.isArray(value)) {
                    if (value.length === 3 && value.every(v => typeof v === 'number' && inRange(0, 255, v))) {
                        this.value = { r: value[0], g: value[1], b: value[2] };
                    } else {
                        throw new Error('Malformed rgb triplet tuple');
                    }
                } else if ([value.r, value.g, value.b].every(v => typeof v === 'number' && inRange(0, 255, v))) {
                    this.value = value;
                } else {
                    throw new Error('Malformed rgb triplet object');
                }
            }
        } else {
            throw new Error('Unexpected call signature');
        }

    }
    public static ansi16To256(value: number): number {
        if (inRange(codes.FG_START, codes.FG_END, value)) {
            return value - codes.FG_START;
        } else if (inRange(codes.FG_BRIGHT_START, codes.FG_BRIGHT_END, value)) {
            return (value - codes.FG_BRIGHT_START) + 8;
        } else  if (inRange(codes.BG_START, codes.BG_END, value)) {
            return value - codes.BG_START;
        } else if (inRange(codes.BG_BRIGHT_START, codes.BG_BRIGHT_END, value)) {
            return (value - codes.BG_BRIGHT_START) + 8;
        } else {
            throw new Error('invalid Ansi16 value');
        }
    }
    public equalCode(other: AnsiColor): boolean {
    }
    public equalColor(other: AnsiColor): boolean {
       return isEqual(this.value, other.value);
    }
}



export class AnsiColorCode {
}

/**
 * **[Warning]**: this function will mutate the parameter `params`
 *
 * @param param color code
 * @param params current stack escape params **[warning will be mutated]**
 * @param paramsSafe original stack of escape params
 */
export function parseColorCode(param: number, params: number[]): AnsiColor {
    if (param === codes.FG_CUSTOM || param === codes.BG_CUSTOM) { // (16bit OR 8bit)
        const codeType = params.pop();
        if (codeType === codes.COLOR_MODE_8BIT) { // 8bit
            if (params.length >= 1) {
                return new AnsiColor_8Bit(params.pop()!);
            } else {
                throw new Error('Malformed ANSI color'); //MalformedAnsiColorCodeError(paramsSafe);
            }
        } else if (codeType === codes.COLOR_MODE_24BIT) { // 24bit
            if (params.length >= 3) {
                let r = params.pop()!;
                let g = params.pop()!;
                let b = params.pop()!;
                return new AnsiColor_24Bit({ r, g, b });
            } else {
                throw new Error('Malformed ANSI color'); //MalformedAnsiColorCodeError(paramsSafe);
            }
        } else {
            throw new Error('Malformed ANSI color'); //MalformedAnsiColorCodeError(paramsSafe);
        }
    } else { // 3bit
        return new AnsiColor_3Bit(param);
    }
}


export type ColorValue = (
    | AnsiColor
    | RGB
    | RGBTuple
    | number
    | string
);

export function refineColorValue(value: ColorValue, kind: 'fg' | 'bg'): AnsiColor {
    if (typeof value === 'string') {
        if (value.startsWith('#')) {
            let hR, hG, hB;
            if (value.length === 7) { // full form
            } else if (value.length === 6) {
            }
        }
    }
}
