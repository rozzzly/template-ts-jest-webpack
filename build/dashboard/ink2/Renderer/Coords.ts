export interface Coords {
    x0: number;
    x1: number;
    y0: number;
    y1: number;
}

export class Coords implements Coords {
    public static translate(base: Coords, xOffset: number, yOffset: number): Coords {
        return {
            x0: base.x0 + xOffset,
            x1: base.x1 + xOffset,
            y0: base.y0 + yOffset,
            y1: base.y1 + yOffset
        };
    }

    public static equalTo(alpha: Coords, bravo: Coords): boolean {
        return (
            alpha === bravo
        ) || (
            alpha.x0 === bravo.x0 &&
            alpha.x1 === bravo.x1 &&
            alpha.y0 === bravo.y0 &&
            alpha.y1 === bravo.y1
        );
    }

    public static overlap(alpha: Coords, bravo: Coords): boolean {
        return !(
            alpha.y1 <= bravo.y0 ||
            alpha.y0 >= bravo.y1 ||
            alpha.x1 <= bravo.x0 ||
            alpha.x0 >= bravo.x1

        );
    }
    public static overlapX(alpha: Coords, bravo: Coords): boolean {
        return !(
            alpha.x1 <= bravo.x0 ||
            alpha.x0 >= bravo.x1
        );
    }
    public static overlapY(alpha: Coords, bravo: Coords): boolean {
        return !(
            alpha.y1 <= bravo.y0 ||
            alpha.y0 >= bravo.y1
        );
    }
}

export default Coords;
