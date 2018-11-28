import { NodeInstance } from '../../Tree';
import { GridSpan } from '../GridRow';
import TreeNode from '../../Tree/TreeNode';
import RectCoords from '../Coords';

export function qSpan(x0: number, x1: number, node?: NodeInstance, y?: number): GridSpan {
    return new GridSpan(
        ((node !== undefined)
            ? node
            : expect.any(TreeNode)
        ),
        x0,
        x1,
        ((y !== undefined)
            ? y
            : expect.any(Number)
        )
    );
}

export function qRect(x0?: number, x1?: number, y0?: number, y1?: number): RectCoords {
    return {
        x0: ((x0 !== undefined)
            ? x0
            : expect.any(Number)
        ),
        x1: ((x1 !== undefined)
            ? x1
            : expect.any(Number)
        ),
        y0: ((y0 !== undefined)
            ? y0
            : expect.any(Number)
        ),
        y1: ((y1 !== undefined)
            ? y1
            : expect.any(Number)
        )
    };
}
