import { literalsEnum, ExtractLiterals } from '../misc';
import { YogaNode, YogaOptions, baseYogaOptions } from './YogaNode';
import { Style, StyleOverride, baseStyle } from '../Text/Style';
import { isEqual } from 'lodash';
import { ContainerNode } from './ContainerNode';
import { NodeKind } from '../Tree';


export abstract class BaseNode<K extends NodeKind> {
    public kind: K;
    public parent: ContainerNode | null = null;
    public yoga: YogaNode | null = null;
    protected yogaOpts: {
        current: YogaOptions;
        diff: Partial<YogaOptions>;
        staged: YogaOptions;
        stale: boolean;
    };

    protected linked: boolean = false;
    protected computed: Style;
    protected override: StyleOverride;

    public constructor(yogaOptions: Partial<YogaOptions> = {}) {
        this.parent = null;
        this.override = {};
        this.yogaOpts = {
            current: {} as YogaOptions,
            diff: { ...baseYogaOptions },
            staged: { ...baseYogaOptions },
            stale: true
        };
    }

    public setTextStyle(styleData: StyleOverride) {
        this.override = { ...styleData };
        this.cascadeTextStyle(this.parent ? this.parent.computed : baseStyle);
    }

    public cascadeTextStyle(inherited: Style): boolean {
        const old = this.computed;
        this.computed = inherited.override(this.override);
        return this.computed === old;
    }

    public setYogaOptions(opts: Partial<YogaOptions>): void {
        const condensed = opts;
        const incoming = { ...baseYogaOptions, ...condensed };
        if (!isEqual(this.yogaOpts.staged, incoming)) {
            Object.keys(incoming).forEach((key: keyof YogaOptions) => {
                if (this.yogaOpts.staged[key] !== incoming[key]) {
                    this.yogaOpts.staged[key] = this.yogaOpts.diff[key] = incoming[key];
                    if (this.yogaOpts.current[key] === incoming[key]) {
                        delete this.yogaOpts.diff[key];
                    }
                }
            });
            this.yogaOpts.stale = true;
        }

        if (this.yoga && this.yogaOpts.stale) this.applyYogaOptions();
    }

    protected applyYogaOptions(): void {
        if (!this.yoga) {
            throw new Error('applyYogaOptions called before node is linked.');
        } else if (this.yogaOpts.stale) {
            const { diff } = this.yogaOpts;


            // update "opts" state
            this.yogaOpts.current = {...this.yogaOpts.staged };
            this.yogaOpts.diff = {};
            this.yogaOpts.stale = false;
        }
    }

    public dispose(): void {
        if (this.yoga) {
            if (this.parent && this.parent.yoga) {
                this.parent.yoga.removeChild(this.yoga);
            }
            this.yoga.free();
            this.yoga = null;
        }
        this.yogaOpts = {
            current: { } as YogaOptions,
            staged: { ...this.yogaOpts.staged } ,
            diff: { ...this.yogaOpts.staged },
            stale: true,
        };
        this.parent = null;
        this.linked = false;
    }

    public createYoga() {
        this.yoga = YogaNode.create();
        this.applyYogaOptions();
    }

    public link(parent: ContainerNode | null, index: number) {
        if (this.linked) {
            this.dispose();
        }
        this.parent = parent;
        this.linked = true;
        this.createYoga();
        if (this.parent) {
            this.cascadeTextStyle(this.parent.computed);

            if (this.parent.yoga) {
                this.parent.yoga.insertChild(this.yoga, index);
            }
        }
    }
}
