import { clampUpper, clamp, inRange } from '../misc';

export interface RowRange {
    y0: number;
    y1: number;
}
export interface ColumnRange {
    x0: number;
    x1: number;
}
export interface PointCoords {
    x: number;
    y: number;
}
export interface SpanCoords extends ColumnRange {
    y: number;
}
export interface RectCoords extends RowRange, ColumnRange { }
export class RectCoords implements RectCoords {


    public static intersection(alpha: RectCoords, bravo: RectCoords): RectCoords | null {
        if (this.overlap(alpha, bravo)) {
            const result = {
                x0: clamp(alpha.x0, alpha.x1, bravo.x0),
                x1: clamp(alpha.x0, alpha.x1, bravo.x1),
                y0: clamp(alpha.y0, alpha.y1, bravo.y0),
                y1: clamp(alpha.y0, alpha.y1, bravo.y1)
            };
            if ((result.x1 - result.x0) > 0 && (result.y1 - result.y0) > 0) { /// TODO :: is this check necessary?
                return result;
            } else return null;
        } else return null;
    }

    public static translate(base: RectCoords, xOffset: number, yOffset: number): RectCoords {
        return {
            x0: base.x0 + xOffset,
            x1: base.x1 + xOffset,
            y0: base.y0 + yOffset,
            y1: base.y1 + yOffset
        };
    }

    public static equalTo(alpha: RectCoords, bravo: RectCoords): boolean {
        return (
            alpha === bravo
        ) || (
            alpha.x0 === bravo.x0 &&
            alpha.x1 === bravo.x1 &&
            alpha.y0 === bravo.y0 &&
            alpha.y1 === bravo.y1
        );
    }

    public static overlap(alpha: RectCoords, bravo: RectCoords): boolean {
        return !(
            alpha.y1 <= bravo.y0 ||
            alpha.y0 >= bravo.y1 ||
            alpha.x1 <= bravo.x0 ||
            alpha.x0 >= bravo.x1
        );
    }

    public static containsRow(rect: RectCoords, y: number): boolean {
        return inRange(rect.y0, rect.y1, y, [false, true]);
    }
    public static containsColumn(rect: RectCoords, x: number): boolean {
        return inRange(rect.x0, rect.x1, x, [false, true]);
    }
    public static containsPoint(rect: RectCoords, point: PointCoords): boolean {
        return (
            inRange(rect.x0, rect.x1, point.x, [false, true]) &&
            inRange(rect.y0, rect.y1, point.y, [false, true])
        );
    }
}

export default RectCoords;
