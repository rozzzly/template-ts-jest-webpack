import * as React from 'react';
import { FiberRoot } from 'react-reconciler';
import createReconciler, { Reconciler } from './reconciler';
import { RootNode } from '../Tree/RootNode';
import RenderGrid from '../Renderer/RenderGrid';
import { any } from 'prop-types';

export type UnmountFn = (cb?: () => void) => void;
export type RenderFn = () => React.ReactElement<any>;
export interface MountOptions {
    stdout: NodeJS.WriteStream;
    stdin: NodeJS.ReadStream;
    height: 'auto' | number;
    width: 'auto' | number;
}
const defaultMountOpts: MountOptions = {
    stdout: process.stdout,
    stdin: process.stdin,
    height: 'auto',
    width: 'auto'
};


export interface MountedInstance {
    dimensions: {
        height: number,
        width: number
    };
    opts: MountOptions;
    container: FiberRoot;
    reconciler: Reconciler;
    renderer: RenderFn;
    render: () => void;
    renderToString: () => string;
    grid: RenderGrid;
    unmount: UnmountFn;
}

const InstanceMap = {
    stdout: new WeakMap<NodeJS.WriteStream, MountedInstance>(),
    unmount: new WeakMap<UnmountFn, MountedInstance>()
};

export const lookupInstance = (unmountFn: UnmountFn): MountedInstance | null => (
    InstanceMap.unmount.get(unmountFn) ||
    null
);

export function renderToString(renderer: RenderFn, options: Partial<MountOptions> = {}): string {
    const inst = mount(renderer, options);
    return inst.grid.renderToString();

}
export function render(renderer: RenderFn, options: Partial<MountOptions> = {}): UnmountFn {
    const inst = mount(renderer, options);
    return inst.unmount;
}

export default function mount(renderer: RenderFn, options: Partial<MountOptions> = {}): MountedInstance {
    const opts: MountOptions = { ...defaultMountOpts, ...options };

    let inst: MountedInstance;
    if (InstanceMap.stdout.has(opts.stdout)) {
        inst = InstanceMap.stdout.get(opts.stdout) as MountedInstance;
        inst.render = renderer;
        /// TODO ::: check if opts !== stored opts and react if needed (eg: resize the grid)

    } else {
        let disposed = false;
        inst = {} as any;
        inst.opts = opts;
        inst.dimensions = { width: opts.width, height: opts.height } as any;
        const autoHeight = opts.height === 'auto';
        const autoWidth = opts.width === 'auto';
        if (autoHeight || autoWidth) {
            if (autoHeight) {
                if (opts.stdout.rows !== undefined) {
                    inst.dimensions.height = opts.stdout.rows;
                } else {
                    throw new Error();
                }
            }
            if (autoWidth) {
                if (opts.stdout.columns !== undefined) {
                    inst.dimensions.width = opts.stdout.columns;
                } else {
                    throw new Error();
                }
            }
            /// TODO ::: listen for resize event
        }
        const reconciler = createReconciler();
        inst.grid  = new RenderGrid(inst.dimensions.width, inst.dimensions.height);
        inst.container = reconciler.createContainer(inst.grid.root, false, false);
        inst.reconciler = reconciler;
        inst.renderer = renderer;
        inst.render = () => {
            reconciler.updateContainer(inst.renderer(), inst.container, null, undefined as any);
            inst.grid.render();
        };
        inst.renderToString = () => {
            inst.render();
            return inst.renderToString();
        };
        inst.unmount = (cb): void => {
            if (disposed) {
                throw new Error('already unmounted!');
            } else {
                disposed = true;
                reconciler.updateContainer(null, inst.container, null, cb as () => void);
                InstanceMap.stdout.delete(opts.stdout);
            }
        };
        InstanceMap.unmount.set(inst.unmount, inst);
        InstanceMap.stdout.set(opts.stdout, inst);
    }

    inst.render();

    return inst;
}
