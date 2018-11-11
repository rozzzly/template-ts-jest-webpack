import { ExtractLiterals, literalsEnum } from '../../misc';
import { Color, RGB } from './Color';
import { StyleProps, baseStyleData, TextWeight, TextTransform, StyleOverride } from '../Style';
import { BackgroundColor, BackgroundColorName, ForegroundColorFlagMap, ColorPalette, ColorName, BackgroundColorFlagMap } from './palette';


export type TextWeightFlagMap = {
    [weight in TextWeight]?: boolean;
};


export type TextTransformsFlagMap = {
    [transform in TextTransform]?: boolean;
};

export type StyleComponentProps = (
    & ForegroundColorFlagMap
    & BackgroundColorFlagMap
    & TextWeightFlagMap
    & TextTransformsFlagMap
    & {
        color?: ColorValue;
        background?: ColorValue;
        weight?: TextWeight;
    }
);
export type ColorValue = (
    | Color
    | RGB
    | string
);


export function composeProps(props: StyleComponentProps) {
    let style: StyleOverride = { };

    let reset: boolean = false;
    let explicitColor: boolean = false;
    let explicitBackground: boolean = false;
    let explicitWeight: boolean = false;

    if (props.weight) {
        explicitWeight = true;
        style.weight = props.weight;
    }

    for (const [key, value] of Object.entries(props)) {
        if (ColorPalette[key as ColorName] && value === true) {
            if (BackgroundColor[key as BackgroundColorName]) {
                if (!explicitBackground) {
                    style.bgColor = ColorPalette[key as ColorName];
                }
            } else {
                if (!explicitColor) {
                    style.fgColor = ColorPalette[key as ColorName];
                }
            }
        } else if (key === 'color') {
            if (typeof value === 'string') {
                if (ColorPalette[value as ColorName]) {
                    explicitColor = true;
                    style.fgColor = ColorPalette[value as ColorName];
                } else {
                    const parsed = Color.fromString(value);
                    if (parsed) {
                        explicitColor = true;
                        style.fgColor = parsed;
                    } /// else throw? warn?
                }
            } else if (value instanceof Color) {
                explicitColor = true;
                style.fgColor = value;
            } /// else throw? warn?
        } else if (key === 'background') {
            if (typeof value === 'string') {
                if (ColorPalette[value as ColorName]) {
                    explicitBackground = true;
                    style.bgColor = ColorPalette[value as ColorName];
                } else {
                    const parsed = Color.fromString(value);
                    if (parsed) {
                        explicitBackground = true;
                        style.bgColor = parsed;
                    } /// else throw? warn?
                }
            } else if (value instanceof Color) {
                explicitColor = true;
                style.bgColor = value;
            } /// else throw? warn?
        } else if (TextTransform[key as TextTransform]) {
             style[key as Exclude<TextTransform, 'reset'>] = value;
        } else if (key === 'weight' && TextWeight[value as TextWeight]) {
            style.weight = TextWeight[value as TextWeight];
            explicitWeight = true;
        } else if (TextWeight[key as TextWeight] && explicitWeight && value === true) {
            style.weight = TextWeight[value as TextWeight];
        } else if (key === 'reset' && value === true) {
            reset = true;
         }
    }

    return reset ? { ...baseStyleData } : style;
}

export default composeProps;
