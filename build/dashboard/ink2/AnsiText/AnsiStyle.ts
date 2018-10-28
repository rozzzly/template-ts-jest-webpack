import { AnsiColor, Colors } from './AnsiColor';

export type AnsiTextWeight = (
    | 'bold'
    | 'faint'
    | 'normal'
);

export interface AnsiStyleData {
    bgColor: AnsiColor;
    fgColor: AnsiColor;
    weight: AnsiTextWeight;
    inverted: boolean;
    underline: boolean;
    italic: boolean;
    strike: boolean;
}


const baseStyleData: AnsiStyleData = {
    fgColor: Colors.fg.DEFAULT,
    bgColor: Colors.bg.DEFAULT,
    weight: 'normal',
    inverted: false,
    underline: false,
    italic: false,
    strike: false
};

export class AnsiStyle implements AnsiStyleData {

    public bgColor: AnsiColor;
    public fgColor: AnsiColor;
    public weight: AnsiTextWeight;
    public inverted: boolean;
    public underline: boolean;
    public italic: boolean;
    public strike: boolean;

    public constructor();
    public constructor(style: AnsiStyleData);
    public constructor(style: Partial<AnsiStyleData>);
    public constructor(style: Partial<AnsiStyleData> = {}) {
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
        return this.weight === 'bold';
    }

    public clone(): AnsiStyle {
        return new AnsiStyle({
            bgColor: this.bgColor.clone(),
            fgColor: this.fgColor.clone(),
            weight: this.weight,
            inverted: this.inverted,
            underline: this.underline,
            italic: this.italic,
            strike: this.strike
        });
    }

    public equalTo(other: AnsiStyle): boolean {
        return (
            this.fgColor.equalTo(other.fgColor)
            && this.bgColor.equalTo(other.bgColor)
            && this.weight === other.weight
            && this.italic === other.italic
            && this.underline === other.underline
            && this.inverted === other.inverted
            && this.strike === other.strike
        );
    }
}
