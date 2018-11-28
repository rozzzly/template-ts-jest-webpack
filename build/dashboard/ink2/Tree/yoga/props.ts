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

export const defaultProps: InternalYogaProps = {
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


export function internalizeProps(incoming: Partial<YogaProps>, staged: InternalYogaProps = defaultProps): InternalYogaProps {
    const res: InternalYogaProps = {
        ...staged
    };

    for (let scalar of scalarValues) {
        if (incoming[scalar] !== undefined) {
            res[scalar] = incoming[scalar]!;
        }
    }

    if (incoming.alignContent) {
        const value = YogaAlignContentValues[incoming.alignContent];
        if (value !== undefined) {
            res.alignContent = value;
        } else {
            throw new TypeError('Unsupported value for YogaAlignContent');
        }
    }

    if (incoming.alignItems) {
        const value = YogaAlignItemsValues[incoming.alignItems];
        if (value !== undefined) {
            res.alignItems = value;
        } else {
            throw new TypeError('Unsupported value for YogaAlignItems');
        }
    }
    if (incoming.alignSelf) {
        const value = YogaAlignSelfValues[incoming.alignSelf];
        if (value !== undefined) {
            res.alignSelf = value;
        } else {
            throw new TypeError('Unsupported value for YogaAlignSelf');
        }
    }
    if (incoming.flexDirection) {
        const value = YogaFlexDirectionValues[incoming.flexDirection];
        if (value !== undefined) {
            res.flexDirection = value;
        } else {
            throw new TypeError('Unsupported value for YogaFlexDirection');
        }
    }
    if (incoming.justifyContent) {
        const value = YogaJustifyContentValues[incoming.justifyContent];
        if (value !== undefined) {
            res.justifyContent = value;
        } else {
            throw new TypeError('Unsupported value for YogaJustifyContent');
        }
    }


    if (incoming.padding !== undefined) {
        if (Array.isArray(incoming.padding)) {
            if (incoming.padding.length === 2) {
                res.padding = {
                    left: incoming.padding[0],
                    top: incoming.padding[1],
                    right: incoming.padding[0],
                    bottom: incoming.padding[1]
                };
            } else if (incoming.padding.length === 4) {
                res.padding = {
                    left: incoming.padding[0],
                    top: incoming.padding[1],
                    right: (incoming.padding as [YogaValue, YogaValue, YogaValue, YogaValue])[2],
                    bottom: (incoming.padding as [YogaValue, YogaValue, YogaValue, YogaValue])[3]
                };
            } else {
                throw new TypeError('unexpected padding array shorthand');
            }
        } else {
            res.padding = {
                left: incoming.padding,
                top: incoming.padding,
                right: incoming.padding,
                bottom: incoming.padding
            };
        }
    }
    if (incoming.paddingHorizontal !== undefined) {
        res.padding.left = incoming.paddingHorizontal;
        res.padding.right = incoming.paddingHorizontal;
    }
    if (incoming.paddingVertical !== undefined) {
        res.padding.top = incoming.paddingVertical;
        res.padding.bottom = incoming.paddingVertical;
    }
    if (incoming.paddingLeft !== undefined) {
        res.padding.left = incoming.paddingLeft;
    }
    if (incoming.paddingTop !== undefined) {
        res.padding.top = incoming.paddingTop;
    }
    if (incoming.paddingRight !== undefined) {
        res.padding.right = incoming.paddingRight;
    }
    if (incoming.paddingBottom !== undefined) {
        res.padding.bottom = incoming.paddingBottom;
    }
    if (incoming.margin !== undefined) {
        if (Array.isArray(incoming.margin)) {
            if (incoming.margin.length === 2) {
                res.margin = {
                    left: incoming.margin[0],
                    top: incoming.margin[1],
                    right: incoming.margin[0],
                    bottom: incoming.margin[1]
                };
            } else if (incoming.margin.length === 4) {
                res.margin = {
                    left: incoming.margin[0],
                    top: incoming.margin[1],
                    right: (incoming.margin as [YogaValue, YogaValue, YogaValue, YogaValue])[2],
                    bottom: (incoming.margin as [YogaValue, YogaValue, YogaValue, YogaValue])[3]
                };
            } else {
                throw new TypeError('unexpected margin array shorthand');
            }
        } else {
            res.margin = {
                left: incoming.margin,
                top: incoming.margin,
                right: incoming.margin,
                bottom: incoming.margin
            };
        }
    }
    if (incoming.marginHorizontal !== undefined) {
        res.margin.left = incoming.marginHorizontal;
        res.margin.right = incoming.marginHorizontal;
    }
    if (incoming.marginVertical !== undefined) {
        res.margin.top = incoming.marginVertical;
        res.margin.bottom = incoming.marginVertical;
    }
    if (incoming.marginLeft !== undefined) {
        res.margin.left = incoming.marginLeft;
    }
    if (incoming.marginTop !== undefined) {
        res.margin.top = incoming.marginTop;
    }
    if (incoming.marginRight !== undefined) {
        res.margin.right = incoming.marginRight;
    }
    if (incoming.marginBottom !== undefined) {
        res.margin.bottom = incoming.marginBottom;
    }
    return res;
}
