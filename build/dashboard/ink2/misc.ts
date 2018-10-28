/**
 * @ https://github.com/Microsoft/TypeScript/issues/28046
 */
export const literals = <T extends string>(...args: T[]): T[]  => args;
export type ExtractLiteral<T extends ReadonlyArray<unknown>> = (
    (T extends ReadonlyArray<infer Literal>
         ? Literal
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
