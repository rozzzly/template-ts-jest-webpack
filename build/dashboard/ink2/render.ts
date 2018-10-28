import * as React from 'react';
import { FiberRoot } from 'react-reconciler';
import createReconciler, { Reconciler } from './reconciler';
import { RootNode } from './InstanceTree';

export type UnmountFn = (cb?: () => void) => void;
export type RenderFn = () => React.ReactElement<any>;
export interface MountOptions {
    stdout: NodeJS.WriteStream;
    stdin: NodeJS.ReadStream;
}

interface MountedInstance {
    container: FiberRoot;
    unmount: UnmountFn;
    reconciler: Reconciler;
}

const instanceMap = new WeakMap<NodeJS.WriteStream, MountedInstance>();

export default function render(renderer: RenderFn, options: Partial<MountOptions> = {}): UnmountFn {
    const opts = { stdout: process.stdout, stdin: process.stdin, ...options };
    let instance: MountedInstance;
    if (instanceMap.has(opts.stdout)) {
        instance = instanceMap.get(opts.stdout) as MountedInstance;
    } else {
        let disposed = false;
        const rootNode = new RootNode();
        const reconciler = createReconciler();
        const container = reconciler.createContainer(rootNode, false, false);
        instance = {
            reconciler,
            container,
            unmount(cb): void {
                if (disposed) {
                    throw new Error('already unmounted!');
                } else {
                    reconciler.updateContainer(null, container, null, cb as () => void);
                    disposed = true;
                    instanceMap.delete(opts.stdout);
                }
            }
        };
        instanceMap.set(opts.stdout, instance);
    }

    instance.reconciler.updateContainer(renderer(), instance.container, null, undefined as any);

    return instance.unmount;
}
