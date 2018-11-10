import { TextColor } from './TextColor';
import { ColorPalette } from './ColorPalette';
import { TextWeight } from './composeProps';
import * as codes from './AnsiCodes';
import { func } from 'prop-types';

export interface TextStyleData {
    bgColor: TextColor;
    fgColor: TextColor;
    weight: TextWeight;
    inverted: boolean;
    underline: boolean;
    italic: boolean;
    strike: boolean;
}

export const baseStyleData: TextStyleData = {
    fgColor: ColorPalette.default,
    bgColor: ColorPalette.bgDefault,
    weight: TextWeight.normal,
    inverted: false,
    underline: false,
    italic: false,
    strike: false
};

export type TextStyleOverride = Partial<TextStyleData>;

export type TextStyle = (
    | ComputedTextStyle
    | TextStyleOverride
);

export class ComputedTextStyle implements TextStyleData {

    public static isComputed(value: unknown): value is ComputedTextStyle {
        return (value instanceof ComputedTextStyle);
    }

    public bgColor: TextColor;
    public fgColor: TextColor;
    public weight: TextWeight;
    public inverted: boolean;
    public underline: boolean;
    public italic: boolean;
    public strike: boolean;

    public constructor();
    public constructor(style: TextStyleOverride);
    public constructor(style: TextStyleOverride = {}) {
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

    public clone(): ComputedTextStyle {
        return new ComputedTextStyle({
            bgColor: this.bgColor,
            fgColor: this.fgColor,
            weight: this.weight,
            inverted: this.inverted,
            underline: this.underline,
            italic: this.italic,
            strike: this.strike
        });
    }

    public code(inherited: ComputedTextStyle = baseStyle): string {
        let params: number[] = [];
        if (!this.fgColor.equalTo(inherited.fgColor)) {
            params = params.concat(this.fgColor.fgCode(false));
        }
        if (!this.bgColor.equalTo(inherited.bgColor)) {
            params = params.concat(this.bgColor.bgCode(false));
        }
        if (this.weight !== inherited.weight) {
            if (this.weight === TextWeight.normal) params.push(codes.WEIGHT_NORMAL);
            else if (this.weight === TextWeight.bold) params.push(codes.WEIGHT_BOLD);
            else params.push(codes.WEIGHT_FAINT);
        }
        if (this.italic !== inherited.italic) {
            if (this.italic) params.push(codes.ITALIC_ON);
            else params.push(codes.ITALIC_OFF);
        }
        if (this.underline !== inherited.underline) {
            if (this.underline) params.push(codes.UNDERLINE_ON);
            else params.push(codes.UNDERLINE_OFF);
        }
        if (this.strike !== inherited.strike) {
            if (this.strike) params.push(codes.STRIKE_ON);
            else params.push(codes.STRIKE_OFF);
        }
        if (this.inverted !== inherited.inverted) {
            if (this.inverted) params.push(codes.INVERT_ON);
            else params.push(codes.INVERT_OFF);
        }

        return codes.composeCode(params);
    }

    public override(style: TextStyle): ComputedTextStyle {
        if (ComputedTextStyle.isComputed(style)) {
            const clone = this.clone();
            clone.fgColor = this.fgColor;
            clone.bgColor = this.bgColor;
            clone.inverted = this.inverted;
            clone.italic = this.italic;
            clone.strike = this.strike;
            clone.underline = this.underline;
            clone.weight = this.weight;
            return this.equalTo(clone) ? this : clone;
        } else {
            const clone = this.clone();
            if (Object.keys(style).length === 0) return this;
            else {
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
            }
            return this.equalTo(clone) ? this : clone;
        }
    }

    public equalTo(other: ComputedTextStyle): boolean {
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

    public static code(style: TextStyle): string {
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

export const baseStyle = new ComputedTextStyle();
