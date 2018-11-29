import { NodeInstance } from '../Tree';
import { SpanCoords } from './Coords';

export class GridSpan implements SpanCoords {
    public y: number;
    public x0: number;
    public x1: number;
    public node: NodeInstance;

    public constructor(node: NodeInstance, x0: number, x1: number, y: number) {
        this.node = node;
        this.x0 = x0;
        this.x1 = x1;
        this.y = y;
    }

    public clone({ node, x0, x1, y }: {
        node?: NodeInstance;
        x0?: number;
        x1?: number;
        y?: number;
    }): GridSpan {
        return new GridSpan(
            node !== undefined ? node : this.node,
            x0 !== undefined ? x0 : this.x0,
            x1 !== undefined ? x1 : this.x1,
            y !== undefined ? y : this.y
        );
    }
}
export default GridSpan;
