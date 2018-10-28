import { literals, ExtractLiteral } from '../misc';

const fgColorKeywords = literals(
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
    'default'
);
export type FGColorKeywords = ExtractLiteral<typeof fgColorKeywords>;
export type FGColorFlagMap = {
    [color in FGColorKeywords]?: boolean;
};
const bgColorKeywords = literals(
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
    'bgDefault'
);
export type BGColorKeywords = ExtractLiteral<typeof bgColorKeywords>;
export type BGColorFlagMap = {
    [color in BGColorKeywords]?: boolean;
};

export const textTransforms = literals(
    'inverted',
    'underline',
    'italic',
    'strike'
);
export type TextTransforms = ExtractLiteral<typeof textTransforms>;
export type TextTransformsFlagMap = {
    [transform in TextTransforms]?: boolean;
};
