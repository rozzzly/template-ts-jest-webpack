import { ExtractLiterals, literalsEnum } from '../../misc';
import { TextColor, ColorValue } from './TextColor';
import { TextStyleData, baseStyleData } from './TextStyle';
import { BackgroundColor, BackgroundColorName, ForegroundColorFlagMap, ColorPalette, ColorName, BackgroundColorFlagMap } from './ColorPalette';




export const TextWeight = literalsEnum(
    'normal',
    'faint',
    'bold'
);
export type TextWeight = ExtractLiterals<typeof TextWeight>;
export type TextWeightFlagMap = {
    [weight in TextWeight]?: boolean;
};

export const TextTransform = literalsEnum(
    'inverted',
    'underline',
    'italic',
    'strike',
    'reset'
);
export type TextTransform = ExtractLiterals<typeof TextTransform>;
export type TextTransformsFlagMap = {
    [transform in TextTransform]?: boolean;
};

export type AnsiStyleProps = (
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

export function composeProps(props: AnsiStyleProps) {
    let style: Partial<TextStyleData> = { };

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
                    const parsed = TextColor.fromString(value);
                    if (parsed) {
                        explicitColor = true;
                        style.fgColor = parsed;
                    } /// else throw? warn?
                }
            } else if (value instanceof TextColor) {
                explicitColor = true;
                style.fgColor = value;
            } /// else throw? warn?
        } else if (key === 'background') {
            if (typeof value === 'string') {
                if (ColorPalette[value as ColorName]) {
                    explicitBackground = true;
                    style.bgColor = ColorPalette[value as ColorName];
                } else {
                    const parsed = TextColor.fromString(value);
                    if (parsed) {
                        explicitBackground = true;
                        style.bgColor = parsed;
                    } /// else throw? warn?
                }
            } else if (value instanceof TextColor) {
                explicitColor = true;
                style.bgColor = value;
            } /// else throw? warn?
        } else if (TextTransform[key as TextTransform]) {
            if (key === 'reset' && value === true) {
                style = { ...baseStyleData };
            } else {
                style[key as Exclude<TextTransform, 'reset'>] = value;
            }
        } else if (key === 'weight' && TextWeight[value as TextWeight]) {
            style.weight = TextWeight[value as TextWeight];
            explicitWeight = true;
        } else if (TextWeight[key as TextWeight] && explicitWeight && value === true) {
            style.weight = TextWeight[value as TextWeight];
        } // log prop??
    }

    return style;
}

export default composeProps;
