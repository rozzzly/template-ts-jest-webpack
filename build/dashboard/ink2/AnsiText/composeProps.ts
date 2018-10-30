import { mapKeys } from 'lodash';

import * as codes from './AnsiCodes';
import { literals, ExtractLiterals } from '../misc';
import { AnsiColor, AnsiColor_3Bit, RGB } from './AnsiColor';
import { AnsiStyleData, baseStyleData } from './AnsiStyle';
import { ColorPalette, ColorNames, ForegroundColors } from './Ansi16Palette';
import { BackgroundColors, BackgroundColorNames } from './ColorPalette';



export type ColorKeywords = ExtractLiterals<typeof ColorKeywords>;
const BackgroundColor = literals(
    'bgBlack',
    'bgBlackBright',
    'bgRed',
    'bgRedBright',
    'bgGreen',
    'bgGreenBright',
    'bgYellow',
    'bgYellowBright',
    'bgBlue',
    'bgBlueBright',
    'bgMagenta',
    'bgMagentaBright',
    'bgCyan',
    'bgCyanBright',
    'bgWhite',
    'bgWhiteBright',
    'bgGray',
    'bgGrey',
    'bgDefault'
);
export type BGColorKeywords = ExtractLiterals<typeof BackgroundColorKeywords>;
export type ColorFlagMap = {
    [color in ColorKeywords]?: boolean;
};

export const FGColorValueMap: { [color in ColorKeywords]: AnsiColor } = {
    ...paletteFromOffset(codes.FG_START),
    ...mapKeys(paletteFromOffset(codes.FG_BRIGHT_START), (_, key) => `${key}Bright`),
    grey: new AnsiColor_3Bit(codes.FG_BRIGHT_START),
    gray: new AnsiColor_3Bit(codes.FG_BRIGHT_START),
    default: new AnsiColor_3Bit(codes.FG_DEFAULT)
} as any;


export type BGColorFlagMap = {
    [color in BGColorKeywords]?: boolean;
};

export const BGColorValueMap: { [color in BGColorKeywords | ColorKeywords]: AnsiColor } = {
    ...paletteFromOffset(codes.BG_START),
    ...mapKeys(paletteFromOffset(codes.BG_START), (_, key) => `bg${key.slice(0, 1).toUpperCase}${key.slice(1)}`),
    ...mapKeys(paletteFromOffset(codes.BG_BRIGHT_START), (_, key) => `${key}Bright`),
    ...mapKeys(paletteFromOffset(codes.BG_BRIGHT_START), (_, key) => `bg${key.slice(0, 1).toUpperCase}${key.slice(1)}Bright`),
    grey: new AnsiColor_3Bit(codes.BG_BRIGHT_START),
    gray: new AnsiColor_3Bit(codes.BG_BRIGHT_START),
    bgGrey: new AnsiColor_3Bit(codes.BG_BRIGHT_START),
    bgGray: new AnsiColor_3Bit(codes.BG_BRIGHT_START),
    default: new AnsiColor_3Bit(codes.BG_DEFAULT),
    bgDefault: new AnsiColor_3Bit(codes.BG_DEFAULT)
} as any;

export const textWeights = literals(
    'normal',
    'faint',
    'bold'
);
export type TextWeight = ExtractLiterals<typeof textWeights>;
export type TextWeightFlagMap = {
    [weight in TextWeight]?: boolean;
};

export const textTransforms = literals(
    'inverted',
    'underline',
    'italic',
    'strike',
    'reset'
);
export type TextTransforms = ExtractLiterals<typeof textTransforms>;
export type TextTransformsFlagMap = {
    [transform in TextTransforms]?: boolean;
};

export type AnsiStyleProps = (
    & ColorFlagMap
    & BGColorFlagMap
    & TextWeightFlagMap
    & TextTransformsFlagMap
    & {
        color?: ColorValue;
        background?: ColorValue;
        weight?: TextWeight;
    }
);

const quickFlagTest = {
    color: ColorKeywords.reduce((reduction, key) => ({
        ...reduction,
        [key]: true
    }), {}) as Record<string, true>,
    background: bgColorKeywords.reduce((reduction, key) => ({
        ...reduction,
        [key]: true
    }), {}) as Record<string, true>,
    transform: textTransforms.reduce((reduction, key) => ({
        ...reduction,
        [key]: true
    }), {}) as Record<string, true>,
    weight: textWeights.reduce((reduction, key) => ({
        ...reduction,
        [key]: true
    }), {}) as Record<string, true>
};





export function composeProps(props: AnsiStyleProps) {
    let style: Partial<AnsiStyleData> = { };

    let reset: boolean = false;
    let explicitColor: boolean = false;
    let explicitBackground: boolean = false;
    let explicitWeight: boolean = false;

    if (props.weight) {
        explicitWeight = true;
        style.weight = props.weight;
    }

    for (const [key, value] of Object.entries(props)) {
        if (ColorPalette[key as ColorNames] && value === true) {
            if (BackgroundColors[key as BackgroundColorNames]) {
                if (!explicitBackground) {
                    props.background = ColorPalette[key as ColorNames];
                }
            } else {
                if (!explicitColor) {
                    props.color = ColorPalette[key as ColorNames];
                }
            }
        } else {
        if (key === 'color') {
            explicitColor = true;
            style
        } else if (quickFlagTest.transform[key]) {
            if (key === 'reset') {
                reset = true;
            } else {
                style[key as Exclude<TextTransforms, 'reset'>] = value;
            }
        }
    }


    if (props.reset) {
        style = { ...baseStyleData, ...style };
    }
}

export default composeProps;
