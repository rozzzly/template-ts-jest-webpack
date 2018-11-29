import * as codes from './AnsiCodes';
import { ExtractLiterals, literalsEnum } from '../../misc';
import { Color } from './Color';

export const CoreColorName = literalsEnum(
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
export type CoreColorName = ExtractLiterals<typeof CoreColorName>;

export const ForegroundColorName = CoreColorName;
export type ForegroundColorName = ExtractLiterals<typeof ForegroundColorName>;
export const BackgroundColorName = literalsEnum(
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
export type BackgroundColorName = ExtractLiterals<typeof BackgroundColorName>;

export const FullColorName = { ...ForegroundColorName, ...BackgroundColorName };
export type FullColorName = ExtractLiterals<typeof FullColorName>;

export const CoreColorPalette = {
    black: Color.Ansi16(0),
    red: Color.Ansi16(1),
    green: Color.Ansi16(2),
    yellow:  Color.Ansi16(3),
    blue: Color.Ansi16(4),
    magenta: Color.Ansi16(5),
    cyan: Color.Ansi16(6),
    white: Color.Ansi16(7),
    blackBright: Color.Ansi16(8),
    redBright: Color.Ansi16(9),
    greenBright: Color.Ansi16(10),
    yellowBright:  Color.Ansi16(11),
    blueBright: Color.Ansi16(12),
    magentaBright: Color.Ansi16(13),
    cyanBright: Color.Ansi16(14),
    whiteBright: Color.Ansi16(15),
    default: Color.default()
} as { [name in CoreColorName]: Color };
/// NOTE :: palette is intentionally built in multiple steps so the aliases
/// have referentially equality which (can be tested for more quickly)
CoreColorPalette.gray = CoreColorPalette.grey = CoreColorPalette.blackBright;

const ColorPalette = CoreColorPalette; // alias for default import
export default ColorPalette;

export const FullColorPalette = { ...CoreColorPalette } as { [name in FullColorName]: Color };
Object.keys(CoreColorPalette).forEach((name: CoreColorName) => (
    FullColorPalette[
        `bg${name[0].toUpperCase() + name.slice(1)}` as BackgroundColorName
    ] = CoreColorPalette[name]
));



export const sgrLookup = {
    fg: {
        [codes.FG_START + 0]: CoreColorPalette.black,
        [codes.FG_START + 1]: CoreColorPalette.red,
        [codes.FG_START + 2]: CoreColorPalette.green,
        [codes.FG_START + 3]: CoreColorPalette.yellow,
        [codes.FG_START + 4]: CoreColorPalette.blue,
        [codes.FG_START + 5]: CoreColorPalette.magenta,
        [codes.FG_START + 6]: CoreColorPalette.cyan,
        [codes.FG_START + 7]: CoreColorPalette.white,
        [codes.FG_BRIGHT_START + 0]: CoreColorPalette.blackBright,
        [codes.FG_BRIGHT_START + 1]: CoreColorPalette.redBright,
        [codes.FG_BRIGHT_START + 2]: CoreColorPalette.greenBright,
        [codes.FG_BRIGHT_START + 3]: CoreColorPalette.yellowBright,
        [codes.FG_BRIGHT_START + 4]: CoreColorPalette.blueBright,
        [codes.FG_BRIGHT_START + 5]: CoreColorPalette.magentaBright,
        [codes.FG_BRIGHT_START + 6]: CoreColorPalette.cyanBright,
        [codes.FG_BRIGHT_START + 7]: CoreColorPalette.whiteBright,
        [codes.FG_DEFAULT]: CoreColorPalette.default,
    },
    bg: {
        [codes.BG_START + 0]: CoreColorPalette.black,
        [codes.BG_START + 1]: CoreColorPalette.red,
        [codes.BG_START + 2]: CoreColorPalette.green,
        [codes.BG_START + 3]: CoreColorPalette.yellow,
        [codes.BG_START + 4]: CoreColorPalette.blue,
        [codes.BG_START + 5]: CoreColorPalette.magenta,
        [codes.BG_START + 6]: CoreColorPalette.cyan,
        [codes.BG_START + 7]: CoreColorPalette.white,
        [codes.BG_BRIGHT_START + 0]: CoreColorPalette.blackBright,
        [codes.BG_BRIGHT_START + 1]: CoreColorPalette.redBright,
        [codes.BG_BRIGHT_START + 2]: CoreColorPalette.greenBright,
        [codes.BG_BRIGHT_START + 3]: CoreColorPalette.yellowBright,
        [codes.BG_BRIGHT_START + 4]: CoreColorPalette.blueBright,
        [codes.BG_BRIGHT_START + 5]: CoreColorPalette.magentaBright,
        [codes.BG_BRIGHT_START + 6]: CoreColorPalette.cyanBright,
        [codes.BG_BRIGHT_START + 7]: CoreColorPalette.whiteBright,
        [codes.BG_DEFAULT]: CoreColorPalette.default
    }
};

export type ForegroundColorFlagMap = {
    [color in ForegroundColorName]?: boolean;
};

export type BackgroundColorFlagMap = {
    [color in BackgroundColorName]?: boolean;
};
