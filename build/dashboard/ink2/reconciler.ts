import create, { Reconciler as ReactReconciler } from 'react-reconciler';
import { NodeInstance } from './Tree';
import RootNode from './Tree/RootNode';
import TextNode from './Tree/TextNode';
import GroupNode from './Tree/GroupNode';

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
        prepareForCommit: noop,
        resetAfterCommit: noop,
        createInstance: (type, props) => {
            return new GroupNode();
        },
        appendInitialChild: (parent, child) => {
        },
        finalizeInitialChildren: noopRet(false),
        prepareUpdate: noopRet(true),
        shouldSetTextContent: (type, props) => {
            return false;
        },
        createTextInstance: (text) => {
            return new TextNode();
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
