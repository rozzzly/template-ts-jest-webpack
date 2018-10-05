declare module 'ink' {
    import { Stream } from 'stream';

    export type Key = string | number;
    export type Ref<T> = (instance: T) => void;
    export type ComponentChild = VNode<any> | string | number | null;
    export type ComponentChildren = ComponentChild[] | ComponentChild | object | string | number | null;

    export type ComponentFactory<P = {}> = ComponentConstructor<P> | StatelessComponent<P>;
    export type Fragment = ComponentFactory;

    export interface Attributes {
        key?: string | number | any;
        jsx?: boolean;
    }

    export interface ClassAttributes<T> extends Attributes {
        ref?: Ref<T>;
    }

    export type RenderableProps<P, RefType = any> = Readonly<
        P & Attributes & { children?: ComponentChildren; ref?: Ref<RefType> }
    >;

    export interface VNode<P = any> {
        type: ComponentFactory<P> | string;
        props: P;
        key?: Key | null;
    }

    export interface StatelessComponent<P = {}> {
        (props: RenderableProps<P>, context?: any): VNode<any> | null;
        displayName?: string;
        defaultProps?: Partial<P>;
    }
    export type SFC<P = {}> = StatelessComponent<P>;

    export interface ComponentConstructor<P = {}, S = {}> {
        new (props: P, context?: any): Component<P, S>;
        displayName?: string;
        defaultProps?: Partial<P>;
    }
    export type ComponentType<P = {}, S = {}> = StatelessComponent<P> | Component<P, S>;

    export interface Component<P = {}, S = {}> {
        componentWillMount?(): void;
        componentDidMount?(): void;
        componentWillUnmount?(): void;
        getChildContext?(): object;
        componentWillReceiveProps?(nextProps: Readonly<P>, nextContext: any): void;
        shouldComponentUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): boolean;
        componentWillUpdate?(nextProps: Readonly<P>, nextState: Readonly<S>, nextContext: any): void;
        componentDidUpdate?(previousProps: Readonly<P>, previousState: Readonly<S>, previousContext: any): void;
    }

    export class Component<P = {}, S = {}> {
        constructor(props?: P, context?: any);

        static displayName?: string;
        // static defaultProps?: Partial<P>;

        state: Readonly<S>;
        props: RenderableProps<P>;
        context: any;
        base?: HTMLElement;

        setState<K extends keyof S>(state: Pick<S, K>, callback?: () => void): void;
        setState<K extends keyof S>(fn: (prevState: S, props: P) => Pick<S, K>, callback?: () => void): void;

        forceUpdate(callback?: () => void): void;

        render(props?: RenderableProps<P>, state?: Readonly<S>, context?: any): ComponentChild;
        /**
         * @deprecated
         * https://reactjs.org/docs/refs-and-the-dom.html#legacy-api-string-refs
         */
        refs: {
            [key: string]: Component | Element;
        };
    }
    }

    export function h<P>(
		node: ComponentFactory<P>,
		params: Attributes & P | null,
		...children: ComponentChildren[]
	): VNode<any>;
	export function h(
		node: string,
		params: JSX.InkAttributes & Record<string, any> | null,
		...children: ComponentChildren[]
	): VNode<any>;

    export type RenderOptions = (
        | {
            stdin?: NodeJS.ReadStream;
            stdout?: NodeJS.WriteStream;
        }
        | NodeJS.WriteStream
    );

    export function renderToString(tree: JSX.Element, prevTree?: JSX.Element): string;
    export function render(tree: JSX.Element, options?: RenderOptions): JSX.Element;

    export const Fragment: SFC;
    export const Bold: SFC;
    export const Underline: SFC;
    export const Color: SFC<Partial<{
        hex: string
        hsl: [number, number, number];
        hsv: [number, number, number];
        hwb: [number, number, number];
        rgb: [number, number, number];
        keyword: string;
        bgHex: string;
        bgHsl: [number, number, number];
        bgHsv: [number, number, number],
        bgHwb: [number, number, number];
        bgRgb: [number, number, number];
        bgKeyword: string;

        reset: boolean;
        bold: boolean;
        dim: boolean;
        italic: boolean;
        underline: boolean;
        inverse: boolean;
        hidden: boolean;
        strikethrough: boolean;

        visible: boolean;

        black: boolean;
        red: boolean;
        green: boolean;
        yellow: boolean;
        blue: boolean;
        magenta: boolean;
        cyan: boolean;
        white: boolean;
        gray: boolean;
        grey: boolean;
        blackBright: boolean;
        redBright: boolean;
        greenBright: boolean;
        yellowBright: boolean;
        blueBright: boolean;
        magentaBright: boolean;
        cyanBright: boolean;
        whiteBright: boolean;

        bgBlack: boolean;
        bgRed: boolean;
        bgGreen: boolean;
        bgYellow: boolean;
        bgBlue: boolean;
        bgMagenta: boolean;
        bgCyan: boolean;
        bgWhite: boolean;
        bgBlackBright: boolean;
        bgRedBright: boolean;
        bgGreenBright: boolean;
        bgYellowBright: boolean;
        bgBlueBright: boolean;
        bgMagentaBright: boolean;
        bgCyanBright: boolean;
        bgWhiteBright: boolean;
    }>>



    export namespace JSX {
        interface Element extends VNode<any> {
        }

        interface ElementClass extends Component<any, any> {
        }

        interface ElementAttributesProperty {
            props: {};
        }

        interface ElementChildrenAttribute {
            children: {};
        }
        export type Fragment = import('ink').Fragment;

        type LibraryManagedAttributes<Component, Props> =
            Component extends { defaultProps: infer Defaults }
                ? Defaultize<Props, Defaults>
                : Props;

        interface InkAttributes { }

        interface IntrinsicElements {
            div: InkAttributes;
            span: InkAttributes;
            br: InkAttributes;
        }
    }
}

type Defaultize<Props, Defaults> = (
    // Distribute over unions
    (Props extends any
        ? (string extends keyof Props
            ? Props
            : (
                & Pick<Props, Exclude<keyof Props, keyof Defaults>>
                & Partial<Pick<Props, Extract<keyof Props, keyof Defaults>>>
                & Partial<Pick<Defaults, Exclude<keyof Defaults, keyof Props>>>
            )
        )
        : never
    )
);
