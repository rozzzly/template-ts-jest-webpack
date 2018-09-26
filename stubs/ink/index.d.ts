declare module 'ink' {
    export type Key = string | number;
    export type Ref<T> = (instance: T) => void;
    export type ComponentChild = VNode<any> | string | number | null;
    export type ComponentChildren = ComponentChild[] | ComponentChild | object | string | number | null;

    export type ComponentFactory<P> = ComponentConstructor<P> | FunctionalComponent<P>;

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

    export interface FunctionalComponent<P = {}> {
        (props: RenderableProps<P>, context?: any): VNode<any> | null;
        displayName?: string;
        defaultProps?: Partial<P>;
    }
    export type SFC<P = {}> = FunctionalComponent<P>;

    export interface ComponentConstructor<P = {}, S = {}> {
        new (props: P, context?: any): Component<P, S>;
        displayName?: string;
        defaultProps?: Partial<P>;
    }
    export  type AnyComponent<P = {}, S = {}> = FunctionalComponent<P> | Component<P, S>;

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

    export abstract class Component<P, S> {
        constructor(props?: P, context?: any);

        static displayName?: string;
        static defaultProps?: any;

        state: Readonly<S>;
        props: RenderableProps<P>;
        context: any;
        base?: HTMLElement;

        setState<K extends keyof S>(state: Pick<S, K>, callback?: () => void): void;
        setState<K extends keyof S>(fn: (prevState: S, props: P) => Pick<S, K>, callback?: () => void): void;

        forceUpdate(callback?: () => void): void;

        abstract render(props?: RenderableProps<P>, state?: Readonly<S>, context?: any): ComponentChild;
    }

    export function h<P>(
		node: ComponentFactory<P>,
		params: Attributes & P | null,
		...children: ComponentChildren[]
	): VNode<any>;
	export function h(
		node: string,
		params: JSX.HTMLAttributes & JSX.SVGAttributes & Record<string, any> | null,
		...children: ComponentChildren[]
	): VNode<any>;

    export function renderToString(tree: JSX.Element): string;
    export function render(tree: JSX.Element, prevTree?: JSX.Element): JSX.Element;
	export function cloneElement(element: JSX.Element, props: any, ...children: ComponentChildren[]): JSX.Element;

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

        type LibraryManagedAttributes<Component, Props> =
            Component extends { defaultProps: infer Defaults }
                ? Defaultize<Props, Defaults>
                : Props;

        interface HTMLAttributes { }
        interface SVGAttributes extends HTMLAttributes { }

        interface IntrinsicElements {
            div: HTMLAttributes;
        }
    }
}

type Defaultize<Props, Defaults> =
    // Distribute over unions
    Props extends any
        ? 	// Make any properties included in Default optional
            & Partial<Pick<Props, Extract<keyof Props, keyof Defaults>>>
            // Include the remaining properties from Props
            & Pick<Props, Exclude<keyof Props, keyof Defaults>>
        : never;
