import { literals, ExtractLiterals, literalsEnum } from '../misc';
import { AnsiColorMode, AnsiColor } from './AnsiColor';

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
    [name in ColorNames]: AnsiColor
};

export const ColorPalette = {
    black: new AnsiColor(0, AnsiColorMode.Ansi16),
    red: new AnsiColor(1, AnsiColorMode.Ansi16),
    green: new AnsiColor(2, AnsiColorMode.Ansi16),
    yellow:  new AnsiColor(3, AnsiColorMode.Ansi16),
    blue: new AnsiColor(4, AnsiColorMode.Ansi16),
    magenta: new AnsiColor(5, AnsiColorMode.Ansi16),
    cyan: new AnsiColor(6, AnsiColorMode.Ansi16),
    white: new AnsiColor(7, AnsiColorMode.Ansi16),
    blackBright: new AnsiColor(8, AnsiColorMode.Ansi16),
    redBright: new AnsiColor(9, AnsiColorMode.Ansi16),
    greenBright: new AnsiColor(10, AnsiColorMode.Ansi16),
    yellowBright:  new AnsiColor(11, AnsiColorMode.Ansi16),
    blueBright: new AnsiColor(12, AnsiColorMode.Ansi16),
    magentaBright: new AnsiColor(13, AnsiColorMode.Ansi16),
    cyanBright: new AnsiColor(14, AnsiColorMode.Ansi16),
    whiteBright: new AnsiColor(15, AnsiColorMode.Ansi16),
    default: new AnsiColor('default')
} as ColorPalette;

/// NOTE :: palette is intentionally built in multiple steps so the `bg{ColorName}` aliases
/// have referentially equality which can be tested for much more quickly
ColorPalette.gray = ColorPalette.grey = ColorPalette.blackBright;
Object.keys(ColorPalette).forEach((name: ColorNames) => {
    ColorPalette[
        `bg${name[0].toUpperCase() + name.slice(1)}` as ColorNames
    ] = ColorPalette[name];
});
