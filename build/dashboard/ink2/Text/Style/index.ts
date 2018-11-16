import * as codes from './AnsiCodes';
import { Color } from './Color';
import { ExtractLiterals, literalsEnum } from '../../misc';
import { ColorPalette } from './palette';


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

export interface StyleProps {
    bgColor: Color;
    fgColor: Color;
    weight: TextWeight;
    inverted: boolean;
    underline: boolean;
    italic: boolean;
    strike: boolean;
}

export const baseStyleData: StyleProps = {
    fgColor: ColorPalette.default,
    bgColor: ColorPalette.bgDefault,
    weight: TextWeight.normal,
    inverted: false,
    underline: false,
    italic: false,
    strike: false
};

export type StyleOverride = Partial<StyleProps>;

export class Style implements StyleProps {

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
    public constructor(style: StyleOverride = {}) {
        const data = { ...baseStyleData, ...style };
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
        return new Style({
            bgColor: this.bgColor,
            fgColor: this.fgColor,
            weight: this.weight,
            inverted: this.inverted,
            underline: this.underline,
            italic: this.italic,
            strike: this.strike
        });
    }

    public code(preceding: Style = baseStyle): string {
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

    public override(style: StyleOverride): Style {
        if (Object.keys(style).length === 0) return this;
        else {
            const clone = this.clone();
            if (style.fgColor !== undefined) {
                clone.fgColor = style.fgColor;
            }
            if (style.bgColor !== undefined) {
                clone.bgColor = style.bgColor;
            }
            if (style.inverted !== undefined) {
                clone.inverted = style.inverted;
            }
            if (style.italic !== undefined) {
                clone.italic = style.italic;
            }
            if (style.strike !== undefined) {
                clone.strike = style.strike;
            }
            if (style.underline !== undefined) {
                clone.underline = style.underline;
            }
            if (style.weight !== undefined) {
                clone.weight = style.weight;
            }
            return this.equalTo(clone) ? this : clone;
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

    public static rollingCode(override: StyleOverride, parent: Style, preceding: Style): [Style, string] {
        const local = parent.override(override);
        const code = local.code(preceding);
        return [local, code];
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
export const baseStyle = Style.base = new Style();
