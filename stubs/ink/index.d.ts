declare module 'ink' {
    import * as react from 'react';

    export const h: typeof react.createElement;
    export function renderToString(tree: JSX.Element): string;
    export function render(tree: JSX.Element, prevTree?: JSX.Element): JSX.Element;
    export function mount(tree: JSX.Element, stream: NodeJS.WritableStream): () => void;

    export class Component<P = {}, S = {}> extends react.Component<P, S> {}
    export type SFC<P = {}> = React.SFC<P>
    export class StringComponent extends Component<{}, {}> { }


    export interface ColorProps {
        hex?: string
        hsl?: [number, number, number];
        hsv?: [number, number, number];
        hwb?: [number, number, number];
        rgb?: [number, number, number];
        keyword?: string;
        bgHex?: string;
        bgHsl?: [number, number, number];
        bgHsv?: [number, number, number],
        bgHwb?: [number, number, number];
        bgRgb?: [number, number, number];
        bgKeyword?: string;

        reset?: boolean;
        bold?: boolean;
        dim?: boolean;
        italic?: boolean;
        underline?: boolean;
        inverse?: boolean;
        hidden?: boolean;
        strikethrough?: boolean;

        visible?: boolean;

        black?: boolean;
        red?: boolean;
        green?: boolean;
        yellow?: boolean;
        blue?: boolean;
        magenta?: boolean;
        cyan?: boolean;
        white?: boolean;
        gray?: boolean;
        grey?: boolean;
        blackBright?: boolean;
        redBright?: boolean;
        greenBright?: boolean;
        yellowBright?: boolean;
        blueBright?: boolean;
        magentaBright?: boolean;
        cyanBright?: boolean;
        whiteBright?: boolean;

        bgBlack?: boolean;
        bgRed?: boolean;
        bgGreen?: boolean;
        bgYellow?: boolean;
        bgBlue?: boolean;
        bgMagenta?: boolean;
        bgCyan?: boolean;
        bgWhite?: boolean;
        bgBlackBright?: boolean;
        bgRedBright?: boolean;
        bgGreenBright?: boolean;
        bgYellowBright?: boolean;
        bgBlueBright?: boolean;
        bgMagentaBright?: boolean;
        bgCyanBright?: boolean;
        bgWhiteBright?: boolean;
    }

    export const Color: SFC<ColorProps>;

    export interface BoxProps {
        width?: number;
        height?: number;
        paddingTop?: number;
        paddingBottom?: number;
        paddingLeft?: number;
        paddingRight?: number;
        paddingX?: number;
        paddingY?: number;
        padding?: number;
        marginTop?: number;
        marginBottom?: number;
        marginLeft?: number;
        marginRight?: number;
        marginX?: number;
        marginY?: number;
        margin?: number;
        flexGrow?: number;
        flexShrink?: number;
        flexDirection?: (
            | 'row'
            | 'row-reverse'
            | 'column'
            | 'column-reverse'
        );
        alignItems?: (
            | 'flex-start'
            | 'center'
            | 'flex-end'
        );
        justifyContent?: (
            | 'flex-start'
            | 'center'
            | 'flex-end'
            | 'space-between'
            | 'space-around'
        )
    }

    export const Box: SFC<BoxProps>;

    export interface TextProps {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
        strikethrough?: boolean;
    }

    export const Text: SFC<TextProps>;

    export const StdinContext: react.Context<{
        stdin: NodeJS.ReadStream
        setRawMode: (isEnabled: boolean) => void;
    }>;
    export const StdoutContext: react.Context<{
        stdout: NodeJS.WriteStream
    }>;
}
