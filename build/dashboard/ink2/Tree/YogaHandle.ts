import { YogaNode, YogaOptions } from './YogaNode';
import { TreeNode } from './TreeNode';


export const baseYogaOptions: YogaOptions = {
    height: 'auto',
    width: 'auto',
} as YogaOptions;


export class YogaHandle {

    public node: YogaNode | null;
    private owner: TreeNode;
    private active: YogaOptions;
    private staged: Partial<YogaOptions>;
    private staleOpts: number;

    public get isStale(): boolean {
        return this.staleOpts > 0;
    }

    public constructor(opts: Partial<YogaOptions>, owner: TreeNode) {
        this.active = { ...baseYogaOptions };
        this.staged = { };
        this.owner = owner;
        this.setOptions({ ...opts });
    }

    public setOptions(incoming: Partial<YogaOptions>): void {
        const keys = Object.keys(incoming) as (keyof YogaOptions)[] ;
        const nKeys = keys.length;
        for (let key: keyof YogaOptions, i = 0; i < nKeys; i++) {
            key = keys[i];
            // if (this.staged)
            if (this.staged[key] !== incoming[key]) {
                if (this.active[key] === incoming) {
                    delete this.staged[key];
                    this.staleOpts--;
                } else {

                }
            }
        }
    }

    protected applyYogaOptions(): void {
        const keys = Object.keys(this.staged) as (keyof YogaOptions)[];
        const nKeys = keys.length;
        let key: keyof YogaOptions;
        let value: YogaOptions[keyof YogaOptions];
        for (let i = 0; i < nKeys; i++) {
            key = keys[i];
            value = (this.staged as YogaOptions)[key];
        }
        this.staged = {};
    }


    public link(index: number): void {
        if (this.node) this.dispose();
        this.node = YogaNode.create();
        if (this.owner.parent && this.owner.parent.yoga.node) {
            this.owner.parent.yoga.node.insertChild(this.node, index);
        }
        this.applyYogaOptions();
    }

    public dispose(): void {
        if (this.node) {
            if (this.owner.parent && this.owner.parent.yoga.node) {
                this.owner.parent.yoga.node.removeChild(this.node);
            }

            this.node.free();
            this.node = null;
        }
    }
}
export default YogaHandle;
