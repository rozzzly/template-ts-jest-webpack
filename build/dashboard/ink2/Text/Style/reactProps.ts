import { ExtractLiterals, literalsEnum } from '../../misc';
import { Color, RGB } from './Color';
import { StyleData, baseStyleData, TextWeight, TextTransform, StyleOverride } from '../Style';
import { ForegroundColorFlagMap, CoreColorPalette, BackgroundColorFlagMap, FullColorPalette, FullColorName, CoreColorName, BackgroundColorName } from './palette';


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


export function composeProps(props: StyleComponentProps): StyleOverride {
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
        if (FullColorPalette[key as FullColorName] && value === true) {
            if (BackgroundColorName[key as BackgroundColorName]) {
                if (!explicitBackground) {
                    style.bgColor = FullColorPalette[key as FullColorName];
                }
            } else {
                if (!explicitColor) {
                    style.fgColor = FullColorPalette[key as FullColorName];
                }
            }
        } else if (key === 'color') {
            if (typeof value === 'string') {
                if (CoreColorPalette[value as CoreColorName]) { // use CoreColorPalette because {color: bgRed} should not happen
                    explicitColor = true;
                    style.fgColor = CoreColorPalette[value as CoreColorName];
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
                if (FullColorPalette[value as FullColorName]) { // use FullColorPalette because {background: bgRed} might happen
                    explicitBackground = true;
                    style.bgColor = FullColorPalette[value as FullColorName];
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
             style[key as TextTransform] = value;
        } else if (key === 'weight' && TextWeight[value as TextWeight]) {
            style.weight = TextWeight[value as TextWeight];
            explicitWeight = true;
        } else if (TextWeight[key as TextWeight] && explicitWeight && value === true) {
            style.weight = TextWeight[value as TextWeight];
        } else if (key === 'reset' && value === true) {
            reset = true;
         }
    }

    return reset ? { ...baseStyleData, ...style } : style;
}

export default composeProps;
