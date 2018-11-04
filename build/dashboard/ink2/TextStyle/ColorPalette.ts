import { literals, ExtractLiterals, literalsEnum } from '../misc';
import { TextColorMode, TextColor } from './TextColor';

export const ForegroundColors = literalsEnum(
    'black',
    'blackBright',
    'red',
    'redBright',
    'green',
    'greenBright',
    'yellow',
    'yellowBright',
    'blue',
    'blueBright',
    'magenta',
    'magentaBright',
    'cyan',
    'cyanBright',
    'white',
    'whiteBright',
    'gray',
    'grey',
    'default'
);
export type ForegroundColorNames = ExtractLiterals<typeof ForegroundColors>;
export const BackgroundColors = literalsEnum(
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
export type BackgroundColorNames = ExtractLiterals<typeof BackgroundColors>;

export type ColorNames = BackgroundColorNames | ForegroundColorNames;

export type ColorPalette = {
    [name in ColorNames]: TextColor
};

export const ColorPalette = {
    black: new TextColor(0, TextColorMode.Ansi16),
    red: new TextColor(1, TextColorMode.Ansi16),
    green: new TextColor(2, TextColorMode.Ansi16),
    yellow:  new TextColor(3, TextColorMode.Ansi16),
    blue: new TextColor(4, TextColorMode.Ansi16),
    magenta: new TextColor(5, TextColorMode.Ansi16),
    cyan: new TextColor(6, TextColorMode.Ansi16),
    white: new TextColor(7, TextColorMode.Ansi16),
    blackBright: new TextColor(8, TextColorMode.Ansi16),
    redBright: new TextColor(9, TextColorMode.Ansi16),
    greenBright: new TextColor(10, TextColorMode.Ansi16),
    yellowBright:  new TextColor(11, TextColorMode.Ansi16),
    blueBright: new TextColor(12, TextColorMode.Ansi16),
    magentaBright: new TextColor(13, TextColorMode.Ansi16),
    cyanBright: new TextColor(14, TextColorMode.Ansi16),
    whiteBright: new TextColor(15, TextColorMode.Ansi16),
    default: new TextColor('default')
} as ColorPalette;

/// NOTE :: palette is intentionally built in multiple steps so the `bg{ColorName}` aliases
/// have referentially equality which can be tested for much more quickly
ColorPalette.gray = ColorPalette.grey = ColorPalette.blackBright;
Object.keys(ColorPalette).forEach((name: ColorNames) => {
    ColorPalette[
        `bg${name[0].toUpperCase() + name.slice(1)}` as ColorNames
    ] = ColorPalette[name];
});


export type ForegroundColorFlagMap = {
    [color in ForegroundColorNames]?: boolean;
};

export type BackgroundColorFlagMap = {
    [color in BackgroundColorNames]?: boolean;
};

