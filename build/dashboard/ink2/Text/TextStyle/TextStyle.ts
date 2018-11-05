import { TextColor } from './TextColor';
import { ColorPalette } from './ColorPalette';
import { TextWeight } from './composeProps';

export interface TextStyleData {
    bgColor: TextColor;
    fgColor: TextColor;
    weight: TextWeight;
    inverted: boolean;
    underline: boolean;
    italic: boolean;
    strike: boolean;
}

export type OwnStyle = Partial<TextStyleData>;

export const baseStyleData: TextStyleData = {
    fgColor: ColorPalette.default,
    bgColor: ColorPalette.bgDefault,
    weight: TextWeight.normal,
    inverted: false,
    underline: false,
    italic: false,
    strike: false
};

export class TextStyle implements TextStyleData {

    public bgColor: TextColor;
    public fgColor: TextColor;
    public weight: TextWeight;
    public inverted: boolean;
    public underline: boolean;
    public italic: boolean;
    public strike: boolean;

    public constructor();
    public constructor(style: Partial<TextStyleData>);
    public constructor(style: Partial<TextStyleData> = {}) {
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

    public clone(): TextStyle {
        return new TextStyle({
            bgColor: this.bgColor,
            fgColor: this.fgColor,
            weight: this.weight,
            inverted: this.inverted,
            underline: this.underline,
            italic: this.italic,
            strike: this.strike
        });
    }

    public mutate(style: OwnStyle): TextStyle {
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

    public equalTo(other: TextStyle): boolean {
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

    public static equalTo(alpha: Partial<TextStyleData>, bravo: Partial<TextStyleData>): boolean {
        return ((
            alpha === bravo
        ) || (
            ((alpha.fgColor === undefined && bravo.fgColor === undefined) || (
                alpha.fgColor !== undefined &&
                bravo.fgColor !== undefined &&
                alpha.fgColor.equalTo(bravo.fgColor)
            )) &&
            ((alpha.bgColor === undefined && bravo.bgColor === undefined) || (
                alpha.bgColor !== undefined &&
                bravo.bgColor !== undefined &&
                alpha.bgColor.equalTo(bravo.bgColor)
            )) &&
            alpha.inverted === bravo.inverted &&
            alpha.italic === bravo.italic &&
            alpha.strike === bravo.strike &&
            alpha.underline === bravo.underline &&
            alpha.weight === bravo.weight
        ));
    }
}

export const baseStyle = new TextStyle(baseStyleData);
