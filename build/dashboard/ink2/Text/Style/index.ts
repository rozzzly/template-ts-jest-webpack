import * as codes from './AnsiCodes';
import { Color } from './Color';
import { ExtractLiterals, literalsEnum } from '../../misc';
import ColorPalette from './palette';


export const TextWeight = literalsEnum(
    'normal',
    'faint',
    'bold'
);
export type TextWeight = ExtractLiterals<typeof TextWeight>;
export const TextTransform = literalsEnum(
    'inverted',
    'underline',
    'italic',
    'strike'
);
export type TextTransform = ExtractLiterals<typeof TextTransform>;

export interface StyleData {
    bgColor: Color;
    fgColor: Color;
    weight: TextWeight;
    inverted: boolean;
    underline: boolean;
    italic: boolean;
    strike: boolean;
}

export const baseStyleData: StyleData = {
    fgColor: ColorPalette.default,
    bgColor: ColorPalette.default,
    weight: TextWeight.normal,
    inverted: false,
    underline: false,
    italic: false,
    strike: false
};

export const isOverrideIdempotent = (override: Style | StyleOverride, currentOverride?: Style | StyleOverride): boolean => (
    Object.keys(override).length === 0 ||
    (!!currentOverride && Style.equalTo(override, currentOverride))
);

export type StyleOverride = Partial<StyleData>;

export class Style implements StyleData {

    public static base: Style;
    public static resetCode: string = codes.composeCode([codes.RESET]);

    public static isStyle(value: unknown): value is Style {
        return (value instanceof Style);
    }
    public static isOverride(value: unknown): value is StyleOverride {
        return !(value instanceof Style);
    }

    public bgColor: Color;
    public fgColor: Color;
    public weight: TextWeight;
    public inverted: boolean;
    public underline: boolean;
    public italic: boolean;
    public strike: boolean;

    public constructor();
    public constructor(style: StyleOverride);
    public constructor(style: StyleOverride, base: Style);
    public constructor(style: StyleOverride = {}, base: Style = baseStyle) {
        const data = { ...base, ...style };
        this.bgColor = data.bgColor;
        this.fgColor = data.fgColor;
        this.weight = data.weight;
        this.inverted = data.inverted;
        this.underline = data.underline;
        this.italic = data.italic;
        this.strike = data.strike;
    }

    public get bold(): boolean {
        return this.weight === 'bold';
    }

    public get faint(): boolean {
        return this.weight === 'faint';
    }

    public clone(): Style {
        return new Style({}, this);
    }

    public code(preceding: Style = baseStyle): string {
        if (this === preceding) return ''; // referential short circuit
        let params: number[] = [];
        if (!this.fgColor.equalTo(preceding.fgColor)) {
            params = params.concat(this.fgColor.fgCode(false));
        }
        if (!this.bgColor.equalTo(preceding.bgColor)) {
            params = params.concat(this.bgColor.bgCode(false));
        }
        if (this.weight !== preceding.weight) {
            if (this.weight === TextWeight.normal) params.push(codes.WEIGHT_NORMAL);
            else if (this.weight === TextWeight.bold) params.push(codes.WEIGHT_BOLD);
            else params.push(codes.WEIGHT_FAINT);
        }
        if (this.italic !== preceding.italic) {
            if (this.italic) params.push(codes.ITALIC_ON);
            else params.push(codes.ITALIC_OFF);
        }
        if (this.underline !== preceding.underline) {
            if (this.underline) params.push(codes.UNDERLINE_ON);
            else params.push(codes.UNDERLINE_OFF);
        }
        if (this.strike !== preceding.strike) {
            if (this.strike) params.push(codes.STRIKE_ON);
            else params.push(codes.STRIKE_OFF);
        }
        if (this.inverted !== preceding.inverted) {
            if (this.inverted) params.push(codes.INVERT_ON);
            else params.push(codes.INVERT_OFF);
        }

        return codes.composeCode(params);
    }

    public override(override: StyleOverride): Style {
        if (isOverrideIdempotent(override)) return this;
        else {
            const changes: StyleOverride =  {};
            if (override.fgColor !== undefined && !this.fgColor.equalTo(override.fgColor)) {
                changes.fgColor = override.fgColor;
            }
            if (override.bgColor !== undefined && !this.bgColor.equalTo(override.bgColor)) {
                changes.bgColor = override.bgColor;
            }
            if (override.inverted !== undefined && this.inverted !== override.inverted) {
                changes.inverted = override.inverted;
            }
            if (override.italic !== undefined && this.italic !== override.italic) {
                changes.italic = override.italic;
            }
            if (override.strike !== undefined && this.strike !== override.strike) {
                changes.strike = override.strike;
            }
            if (override.underline !== undefined && this.underline !== override.underline) {
                changes.underline = override.underline;
            }
            if (override.weight !== undefined && this.weight !== override.weight) {
                changes.weight = override.weight;
            }

            return isOverrideIdempotent(changes) ? this : new Style(changes, this);
        }
    }

    public equalTo(other: Style): boolean {
        return ((
            this === other
        ) || (
            this.fgColor.equalTo(other.fgColor) &&
            this.bgColor.equalTo(other.bgColor) &&
            this.weight === other.weight &&
            this.italic === other.italic &&
            this.underline === other.underline &&
            this.inverted === other.inverted &&
            this.strike === other.strike
        ));
    }

    public static equalTo(alpha: Style | StyleOverride, bravo: Style | StyleOverride): boolean {
        if (alpha.weight !== bravo.weight) return false;
        else if (alpha.underline !== bravo.underline) return false;
        else if (alpha.strike !== bravo.strike) return false;
        else if (alpha.italic !== bravo.italic) return false;
        else if (alpha.inverted !== bravo.inverted) return false;
        else {
            if (alpha.bgColor) {
                if (bravo.bgColor) {
                    if (!alpha.bgColor.equalTo(alpha.bgColor)) {
                        return false;
                    }
                } else return false;
            }
            if (alpha.fgColor) {
                if (bravo.fgColor) {
                    if (!alpha.fgColor.equalTo(alpha.fgColor)) {
                        return false;
                    }
                } else return false;
            }
            return true;
        }
    }

    public static code(style: Style | StyleOverride): string {
        let params: number[] = [];
        if (style.fgColor !== undefined) {
            params = params.concat(style.fgColor.fgCode(false));
        }
        if (style.bgColor !== undefined) {
            params = params.concat(style.bgColor.bgCode(false));
        }
        if (style.weight !== undefined) {
            if (style.weight === TextWeight.normal) params.push(codes.WEIGHT_NORMAL);
            else if (style.weight === TextWeight.bold) params.push(codes.WEIGHT_BOLD);
            else params.push(codes.WEIGHT_FAINT);
        }
        if (style.italic !== undefined) {
            if (style.italic) params.push(codes.ITALIC_ON);
            else params.push(codes.ITALIC_OFF);
        }
        if (style.underline !== undefined) {
            if (style.underline) params.push(codes.UNDERLINE_ON);
            else params.push(codes.UNDERLINE_OFF);
        }
        if (style.strike !== undefined) {
            if (style.strike) params.push(codes.STRIKE_ON);
            else params.push(codes.STRIKE_OFF);
        }
        if (style.inverted !== undefined) {
            if (style.inverted) params.push(codes.INVERT_ON);
            else params.push(codes.INVERT_OFF);
        }
        return codes.composeCode(params);
    }
}
export const baseStyle = Style.base = new Style(baseStyleData);
export default Style;
