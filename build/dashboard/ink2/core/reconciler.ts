import * as create from 'react-reconciler';
import { Reconciler as ReactReconciler, } from 'react-reconciler';
import { NodeInstance } from '../Tree';
import RootNode from '../Tree/RootNode';
import TextNode from '../Tree/TextNode';
import GroupNode from '../Tree/GroupNode';
import composeProps from '../Text/Style/reactProps';

const noopRet = <T>(value: T) => () => value;
const noop = () => {};

export type Reconciler = ReactReconciler<GroupNode, TextNode, RootNode, NodeInstance>;

export default function createReconciler(): Reconciler {
    const rootHostContext = {};
    const childHostContext = {};

    return create({
        isPrimaryRenderer: true,
        supportsMutation: true,
        supportsHydration: false,
        supportsPersistence: false,
        getRootHostContext: _ => rootHostContext,
        getChildHostContext: _ => childHostContext,
        getPublicInstance: instance => instance,
        prepareForCommit: () => {
            let two = 1 + 1;
        },
        resetAfterCommit: () => {
            let two = 1 + 1;
        },
        createInstance: (type, props) => {
            if (type === 'div' && 'data-yoga' in props) {
                return new GroupNode(props['data-yoga'], {});
            } else if (type === 'style' && 'data-style' in props) {
                return new GroupNode({}, composeProps(props['data-style']));
            } else {
                return new GroupNode({}, {});
            }
        },
        appendInitialChild: (parent, child) => {
            parent.appendChild(child);
        },
        appendChildToContainer: (container, child) => {
            container.appendChild(child);
        },
        finalizeInitialChildren: () => {
            return false;
        },
        prepareUpdate: () => {
            return true;
        },
        shouldSetTextContent: (type, props) => {
            return false;
        },
        createTextInstance: (text) => {
            return new TextNode(text);
        },
        // fiber / scheduling things I'm not going to worry about right now
        shouldDeprioritizeSubtree: noopRet(false),
        scheduleDeferredCallback: undefined as any,
        cancelDeferredCallback: undefined as any,
        now: Date.now,
        setTimeout: undefined as any,
        clearTimeout: undefined as any,
        noTimeout: undefined as any,
     });
}

export { createReconciler };
