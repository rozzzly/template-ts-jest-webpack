import * as codes from './AnsiCodes';
import { literals, ExtractLiterals, literalsEnum } from '../../misc';
import { TextColorMode, TextColor } from './TextColor';

export const ForegroundColor = literalsEnum(
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
export type ForegroundColorName = ExtractLiterals<typeof ForegroundColor>;
export const BackgroundColor = literalsEnum(
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
export type BackgroundColorName = ExtractLiterals<typeof BackgroundColor>;

export type ColorName = BackgroundColorName | ForegroundColorName;

export type ColorPalette = {
    [name in ColorName]: TextColor
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
Object.keys(ColorPalette).forEach((name: ColorName) => (
    ColorPalette[
        `bg${name[0].toUpperCase() + name.slice(1)}` as ColorName
    ] = ColorPalette[name]
));


export const sgrLookup = {
    fg: {
        [codes.FG_START + 0]: ColorPalette.black,
        [codes.FG_START + 1]: ColorPalette.red,
        [codes.FG_START + 2]: ColorPalette.green,
        [codes.FG_START + 3]: ColorPalette.yellow,
        [codes.FG_START + 4]: ColorPalette.blue,
        [codes.FG_START + 5]: ColorPalette.magenta,
        [codes.FG_START + 6]: ColorPalette.cyan,
        [codes.FG_START + 7]: ColorPalette.white,
        [codes.FG_BRIGHT_START + 0]: ColorPalette.blackBright,
        [codes.FG_BRIGHT_START + 1]: ColorPalette.redBright,
        [codes.FG_BRIGHT_START + 2]: ColorPalette.greenBright,
        [codes.FG_BRIGHT_START + 3]: ColorPalette.yellowBright,
        [codes.FG_BRIGHT_START + 4]: ColorPalette.blueBright,
        [codes.FG_BRIGHT_START + 5]: ColorPalette.magentaBright,
        [codes.FG_BRIGHT_START + 6]: ColorPalette.cyanBright,
        [codes.FG_BRIGHT_START + 7]: ColorPalette.whiteBright,
        [codes.FG_DEFAULT]: ColorPalette.default,
    },
    bg: {
        [codes.BG_START + 0]: ColorPalette.black,
        [codes.BG_START + 1]: ColorPalette.red,
        [codes.BG_START + 2]: ColorPalette.green,
        [codes.BG_START + 3]: ColorPalette.yellow,
        [codes.BG_START + 4]: ColorPalette.blue,
        [codes.BG_START + 5]: ColorPalette.magenta,
        [codes.BG_START + 6]: ColorPalette.cyan,
        [codes.BG_START + 7]: ColorPalette.white,
        [codes.BG_BRIGHT_START + 0]: ColorPalette.blackBright,
        [codes.BG_BRIGHT_START + 1]: ColorPalette.redBright,
        [codes.BG_BRIGHT_START + 2]: ColorPalette.greenBright,
        [codes.BG_BRIGHT_START + 3]: ColorPalette.yellowBright,
        [codes.BG_BRIGHT_START + 4]: ColorPalette.blueBright,
        [codes.BG_BRIGHT_START + 5]: ColorPalette.magentaBright,
        [codes.BG_BRIGHT_START + 6]: ColorPalette.cyanBright,
        [codes.BG_BRIGHT_START + 7]: ColorPalette.whiteBright,
        [codes.BG_DEFAULT]: ColorPalette.default
    }
};

export type ForegroundColorFlagMap = {
    [color in ForegroundColorName]?: boolean;
};

export type BackgroundColorFlagMap = {
    [color in BackgroundColorName]?: boolean;
};
