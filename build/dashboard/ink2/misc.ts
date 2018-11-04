/**
 * @ https://github.com/Microsoft/TypeScript/issues/28046
 */
export const literals = <T extends string>(...args: T[]): T[]  => (
    args
);

export const literalsEnum = <T extends string/*  | number */>(...args: T[]): { [K in T]: K }  => (
    args.reduce((reduction, lit) => ({
        ...reduction,
        [lit]: lit
    }), { }) as { [K in T]: K }
);
export type ExtractLiterals<T> = (
    (T extends ReadonlyArray<infer Literal>
         ? Literal
         : T extends { }
            ? keyof T
            : never
    )
);

/**
 * @param {number} lowerLimit the lower bound (inclusive by default)
 * @param {number} upperLimit the upper bound (inclusive by default)
 * @param {number} value value to test to see if is in range
 * @returns {boolean} wether or nor value is in the given range
 */
export function inRange(lowerLimit: number, upperLimit: number, value: number): boolean;
/**
 * @param {number} lowerLimit the lower bound (exclusivity dependant on `isExclusive` param)
 * @param {number} upperLimit the upper bound (exclusivity dependant on `isExclusive` param)
 * @param {number} value value to test to see if is in range
 * @param {boolean = false} isExclusive wether or now the upper/lower bound are exclusive (default: false)
 * @returns {boolean} wether or nor value is in the given range
 */
export function inRange(lowerLimit: number, upperLimit: number, value: number, isExclusive: boolean): boolean;
export function inRange(lowerLimit: number, upperLimit: number, value: number, isExclusive: boolean = false): boolean {
    return (
        isExclusive && (
            value > lowerLimit && value < upperLimit
        ) || (
            value >= lowerLimit && value <= upperLimit
        )
    );
}