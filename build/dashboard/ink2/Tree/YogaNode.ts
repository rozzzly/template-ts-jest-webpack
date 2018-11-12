

export type YogaNode = any; /// TODO find/write type defs
export const YogaNode: YogaNode = {};

export interface YogaOptions {
    height: (
        | string
        | number
    );
    width: (
        | string
        | number
    );
    flexDirection: (
        | 'row'
        | 'row-reverse'
        | 'column'
        | 'column-reverse'
    );
}


export const baseYogaOptions: YogaOptions = {} as YogaOptions;
