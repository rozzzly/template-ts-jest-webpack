declare module 'ink' {
    import { createElement, Component as ReactComponent, SFC , ReactElement} from 'react';

    // TODO: more styles
    export interface Styles {
        green: boolean;
    }

    export { SFC };
    export class Component<P = {}, S = {}> extends ReactComponent<P, S> {}
    export class StringComponent extends Component<{}, {}> { }
    export class Newline extends Component<{}, {}> {}
    export class Indent extends Component<{ size: number; indent: string }, {}> {}
    export class Group extends Component<{}, {}> {}
    export class Div extends Component {}
    export class Span extends Component {}
    export class Text extends Component<Partial<Styles>, {}> {}

    export namespace JSX {
        export interface Element {}
        export interface IntrinsicElements {
            div: Component;
        }
    }

    // TODO: diff
    export const h: typeof createElement;
    export function renderToString(tree: JSX.Element): string;
    export function render(tree: JSX.Element, prevTree?: JSX.Element): JSX.Element;
    export function mount(tree: JSX.Element, stream: NodeJS.WritableStream): () => void;
}
