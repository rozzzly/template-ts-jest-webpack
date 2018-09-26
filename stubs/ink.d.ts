// // Declared props take priority over inferred props
// // If declared props have indexed properties, ignore inferred props entirely as keyof gets widened
// type MergePropTypes<P, T> = P & Pick<T, Exclude<keyof T, keyof P>>;

// // Any prop that has a default prop becomes optional, but its type is unchanged
// // Undeclared default props are augmented into the resulting allowable attributes
// // If declared props have indexed properties, ignore default props entirely as keyof gets widened
// // Wrap in an outer-level conditional type to allow distribution over props that are unions
// type Defaultize<P, D> = P extends any
//     ? string extends keyof P ? P :
//         & Pick<P, Exclude<keyof P, keyof D>>
//         & Partial<Pick<P, Extract<keyof P, keyof D>>>
//         & Partial<Pick<D, Exclude<keyof D, keyof P>>>
//     : never;

//     interface ElementAttributesProperty { props: {}; }
//     interface ElementChildrenAttribute { children: {}; }

//     type LibraryManagedAttributes<C, P> = C extends { propTypes: infer T; defaultProps: infer D; }
//         ? Defaultize<MergePropTypes<P, PropTypes.InferProps<T>>, D>
//         : C extends { propTypes: infer T; }
//             ? MergePropTypes<P, PropTypes.InferProps<T>>
//             : C extends { defaultProps: infer D; }
//                 ? Defaultize<P, D>
//                 : P;
declare module 'ink' {
    import * as React from 'react';

    // TODO: more styles
    export interface Styles {
        green: boolean;
    }

    export interface SFC<P = {}> extends React.SFC<P> {}
    export class Component<P = {}, S = {}> extends React.Component<P, S> {}
    export class StringComponent extends Component<{}, {}> { }
    export class Newline extends Component<{}, {}> {}
    export class Indent extends Component<{ size: number; indent: string }, {}> {}
    export class Group extends Component<{}, {}> {}
    export class Div extends Component {}
    export class Span extends Component {}
    export class Text extends Component<Partial<Styles>, {}> {}



    export namespace h {
        namespace JSX {
            export interface Element {}
            export interface IntrinsicElements {
                div: Element;
            }
        }
    }
    export function h(): h.JSX.Element;

    // TODO: diff
    export function renderToString(tree: h.JSX.Element): string;
    export function render(tree: h.JSX.Element, prevTree?: h.JSX.Element): h.JSX.Element;
    export function mount(tree: h.JSX.Element, stream: NodeJS.WritableStream): () => void;
}
