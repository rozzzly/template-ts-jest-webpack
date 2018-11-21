import {
    YogaAlignItems,
    YogaAlignSelf,
    YogaAlignContent,
    YogaJustifyContent,
    YogaFlexDirection,
    YogaAlignItemsValues,
    YogaAlignSelfValues,
    YogaAlignContentValues,
    YogaJustifyContentValues,
    YogaFlexDirectionValues
} from './constants';
import { literals } from '../../misc';


export type YogaValue = string | number;
export interface SharedYogaOptions {
    height: (
        | 'auto'
        | YogaValue
    );
    minHeight: (
        | 'auto'
        | YogaValue
    );
    maxHeight: (
        | 'auto'
        | YogaValue
    );
    width: (
        | 'auto'
        | YogaValue
    );
    minWidth: (
        | 'auto'
        | YogaValue
    );
    maxWidth: (
        | 'auto'
        | YogaValue
    );
    flexShrink: number;
    flexGrow: number;
    flexBasis: (
        | 'auto'
        | YogaValue
    );
}
export interface YogaProps extends SharedYogaOptions {
    padding: YogaValue | [YogaValue, YogaValue] | [YogaValue, YogaValue, YogaValue, YogaValue];
    paddingLeft: YogaValue;
    paddingTop: YogaValue;
    paddingRight: YogaValue;
    paddingBottom: YogaValue;
    paddingHorizontal: YogaValue;
    paddingVertical: YogaValue;
    margin: YogaValue | [YogaValue, YogaValue] | [YogaValue, YogaValue, YogaValue, YogaValue];
    marginLeft: YogaValue;
    marginTop: YogaValue;
    marginRight: YogaValue;
    marginBottom: YogaValue;
    marginHorizontal: YogaValue;
    marginVertical: YogaValue;
    alignItems: YogaAlignItems;
    alignSelf: YogaAlignSelf;
    alignContent: YogaAlignContent;
    justifyContent: YogaJustifyContent;
    flexDirection: YogaFlexDirection;
}

export interface InternalYogaProps extends SharedYogaOptions {
    padding: {
        left: YogaValue;
        top: YogaValue;
        right: YogaValue;
        bottom: YogaValue;
    };
    margin: {
        left: YogaValue;
        top: YogaValue;
        right: YogaValue;
        bottom: YogaValue;
    };
    alignItems: YogaAlignItemsValues;
    alignSelf: YogaAlignSelfValues;
    alignContent: YogaAlignContentValues;
    justifyContent: YogaJustifyContentValues;
    flexDirection: YogaFlexDirectionValues;
}

export interface ComputedLayout {
    width: number;
    height: number;
    top: number;
    left: number;
    right: number;
    bottom: number;
}


const scalarValues = literals(
    'height',
    'maxHeight',
    'minHeight',
    'width',
    'maxWidth',
    'minWidth',
    'flexGrow',
    'flexShrink',
    'flexBasis'
);

export const defaultOpts: InternalYogaProps = {
    maxHeight: 'auto',
    minHeight: 'auto',
    maxWidth: 'auto',
    minWidth: 'auto',
    width: 'auto',
    height: 'auto',
    padding: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    margin: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0
    },
    alignItems: YogaAlignItemsValues.default,
    alignContent: YogaAlignContentValues.default,
    alignSelf: YogaAlignSelfValues.default,
    flexDirection: YogaFlexDirectionValues.default,
    justifyContent: YogaJustifyContentValues.default,
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 'auto'
};


export function internalizeProps(staged: Partial<YogaProps>, active: InternalYogaProps = defaultOpts): InternalYogaProps {
    const res: InternalYogaProps = {
        ...active
    };

    for (let scalar of scalarValues) {
        if (staged[scalar] !== undefined) {
        res[scalar] = staged[scalar]!;
        }
    }

    if (staged.alignContent) {
        const value = YogaAlignContentValues[staged.alignContent];
        if (value !== undefined) {
            res.alignContent = value;
        } else {
            throw new TypeError('Unsupported value for YogaAlignContent');
        }
    }

    if (staged.alignItems) {
        const value = YogaAlignItemsValues[staged.alignItems];
        if (value !== undefined) {
            res.alignItems = value;
        } else {
            throw new TypeError('Unsupported value for YogaAlignItems');
        }
    }
    if (staged.alignSelf) {
        const value = YogaAlignSelfValues[staged.alignSelf];
        if (value !== undefined) {
            res.alignSelf = value;
        } else {
            throw new TypeError('Unsupported value for YogaAlignSelf');
        }
    }
    if (staged.flexDirection) {
        const value = YogaFlexDirectionValues[staged.flexDirection];
        if (value !== undefined) {
            res.flexDirection = value;
        } else {
            throw new TypeError('Unsupported value for YogaFlexDirection');
        }
    }
    if (staged.justifyContent) {
        const value = YogaJustifyContentValues[staged.justifyContent];
        if (value !== undefined) {
            res.justifyContent = value;
        } else {
            throw new TypeError('Unsupported value for YogaJustifyContent');
        }
    }


    if (staged.padding !== undefined) {
        if (Array.isArray(staged.padding)) {
            if (staged.padding.length === 2) {
                res.padding = {
                    left: staged.padding[0],
                    top: staged.padding[1],
                    right: staged.padding[0],
                    bottom: staged.padding[1]
                };
            } else if (staged.padding.length === 4) {
                res.padding = {
                    left: staged.padding[0],
                    top: staged.padding[1],
                    right: (staged.padding as [YogaValue, YogaValue, YogaValue, YogaValue])[2],
                    bottom: (staged.padding as [YogaValue, YogaValue, YogaValue, YogaValue])[3]
                };
            } else {
                throw new TypeError('unexpected padding array shorthand');
            }
        } else {
            res.padding = {
                left: staged.padding,
                top: staged.padding,
                right: staged.padding,
                bottom: staged.padding
            };
        }
    }
    if (staged.paddingHorizontal !== undefined) {
        res.padding.left = staged.paddingHorizontal;
        res.padding.right = staged.paddingHorizontal;
    }
    if (staged.paddingVertical !== undefined) {
        res.padding.top = staged.paddingVertical;
        res.padding.bottom = staged.paddingVertical;
    }
    if (staged.paddingLeft !== undefined) {
        res.padding.left = staged.paddingLeft;
    }
    if (staged.paddingTop !== undefined) {
        res.padding.top = staged.paddingTop;
    }
    if (staged.paddingRight !== undefined) {
        res.padding.right = staged.paddingRight;
    }
    if (staged.paddingBottom !== undefined) {
        res.padding.bottom = staged.paddingBottom;
    }
    if (staged.margin !== undefined) {
        if (Array.isArray(staged.margin)) {
            if (staged.margin.length === 2) {
                res.margin = {
                    left: staged.margin[0],
                    top: staged.margin[1],
                    right: staged.margin[0],
                    bottom: staged.margin[1]
                };
            } else if (staged.margin.length === 4) {
                res.margin = {
                    left: staged.margin[0],
                    top: staged.margin[1],
                    right: (staged.margin as [YogaValue, YogaValue, YogaValue, YogaValue])[2],
                    bottom: (staged.margin as [YogaValue, YogaValue, YogaValue, YogaValue])[3]
                };
            } else {
                throw new TypeError('unexpected margin array shorthand');
            }
        } else {
            res.margin = {
                left: staged.margin,
                top: staged.margin,
                right: staged.margin,
                bottom: staged.margin
            };
        }
    }
    if (staged.marginHorizontal !== undefined) {
        res.margin.left = staged.marginHorizontal;
        res.margin.right = staged.marginHorizontal;
    }
    if (staged.marginVertical !== undefined) {
        res.margin.top = staged.marginVertical;
        res.margin.bottom = staged.marginVertical;
    }
    if (staged.marginLeft !== undefined) {
        res.margin.left = staged.marginLeft;
    }
    if (staged.marginTop !== undefined) {
        res.margin.top = staged.marginTop;
    }
    if (staged.marginRight !== undefined) {
        res.margin.right = staged.marginRight;
    }
    if (staged.marginBottom !== undefined) {
        res.margin.bottom = staged.marginBottom;
    }
    return res;
}
