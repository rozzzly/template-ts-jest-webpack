declare function memoizeOne<T extends (...args: any[]) => any>(resultFn: T, isEqual?: EqualityFn): T;
declare type EqualityFn = (a: any, b: any) => boolean;

declare module 'memoize-one';
