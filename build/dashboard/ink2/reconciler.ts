import create, { Reconciler as ReactReconciler } from 'react-reconciler';
import { TextNode, NodeInstance, RootNode, ContainerNode } from './InstanceTree';

const noopRet = <T>(value: T) => () => value;
const noop = () => {};

export type Reconciler = ReactReconciler<ContainerNode, TextNode, RootNode, NodeInstance>;

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
            return new ContainerNode();
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
