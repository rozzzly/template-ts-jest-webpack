import * as yoga from 'yoga-layout';
import { literalsEnum, ExtractLiterals, literals } from '../../misc';

export type ValuesIn<T extends object> = T[keyof T];

export const YogaAlignItems = literalsEnum(
    'auto',
    'flexStart',
    'center',
    'flexEnd',
    'stretch',
    'baseline',
    'spaceBetween',
    'spaceAround'
);
export type YogaAlignItems = ExtractLiterals<typeof YogaAlignItems>;
export const YogaAlignItemsValues = {
    default: yoga.ALIGN_STRETCH,
    [YogaAlignItems.auto]: yoga.ALIGN_AUTO,
    [YogaAlignItems.flexStart]: yoga.ALIGN_FLEX_START,
    [YogaAlignItems.center]: yoga.ALIGN_CENTER,
    [YogaAlignItems.flexEnd]: yoga.ALIGN_FLEX_END,
    [YogaAlignItems.stretch]: yoga.ALIGN_STRETCH,
    [YogaAlignItems.baseline]: yoga.ALIGN_BASELINE,
    [YogaAlignItems.spaceBetween]: yoga.ALIGN_SPACE_BETWEEN,
    [YogaAlignItems.spaceAround]: yoga.ALIGN_SPACE_AROUND,
};
export type YogaAlignItemsValues = ValuesIn<typeof YogaAlignItemsValues>;

export const YogaAlignContent = literalsEnum(
    'auto',
    'flexStart',
    'center',
    'flexEnd',
    'stretch',
    'baseline',
    'spaceBetween',
    'spaceAround'
);
export type YogaAlignContent = ExtractLiterals<typeof YogaAlignContent>;
export const YogaAlignContentValues = {
    default: yoga.ALIGN_FLEX_START,
    [YogaAlignContent.auto]: yoga.ALIGN_AUTO,
    [YogaAlignContent.flexStart]: yoga.ALIGN_FLEX_START,
    [YogaAlignContent.center]: yoga.ALIGN_CENTER,
    [YogaAlignContent.flexEnd]: yoga.ALIGN_FLEX_END,
    [YogaAlignContent.stretch]: yoga.ALIGN_STRETCH,
    [YogaAlignContent.baseline]: yoga.ALIGN_BASELINE,
    [YogaAlignContent.spaceBetween]: yoga.ALIGN_SPACE_BETWEEN,
    [YogaAlignContent.spaceAround]: yoga.ALIGN_SPACE_AROUND,
};
export type YogaAlignContentValues = ValuesIn<typeof YogaAlignContentValues>;

export const YogaAlignSelf = literalsEnum(
    'auto',
    'flexStart',
    'center',
    'flexEnd',
    'stretch',
    'baseline',
    'spaceBetween',
    'spaceAround'
);
export type YogaAlignSelf = ExtractLiterals<typeof YogaAlignSelf>;
export const YogaAlignSelfValues = {
    default: yoga.ALIGN_AUTO,
    [YogaAlignSelf.auto]: yoga.ALIGN_AUTO,
    [YogaAlignSelf.flexStart]: yoga.ALIGN_FLEX_START,
    [YogaAlignSelf.center]: yoga.ALIGN_CENTER,
    [YogaAlignSelf.flexEnd]: yoga.ALIGN_FLEX_END,
    [YogaAlignSelf.stretch]: yoga.ALIGN_STRETCH,
    [YogaAlignSelf.baseline]: yoga.ALIGN_BASELINE,
    [YogaAlignSelf.spaceBetween]: yoga.ALIGN_SPACE_BETWEEN,
    [YogaAlignSelf.spaceAround]: yoga.ALIGN_SPACE_AROUND,
};
export type YogaAlignSelfValues = ValuesIn<typeof YogaAlignSelfValues>;

export const YogaJustifyContent = literalsEnum(
    'flexStart',
    'center',
    'flexEnd',
    'spaceBetween',
    'spaceAround',
    'evenly'
);
export type YogaJustifyContent = ExtractLiterals<typeof YogaJustifyContent>;
export const YogaJustifyContentValues = {
    default: yoga.JUSTIFY_FLEX_START,
    [YogaJustifyContent.flexStart]: yoga.JUSTIFY_FLEX_START,
    [YogaJustifyContent.center]: yoga.JUSTIFY_CENTER,
    [YogaJustifyContent.flexEnd]: yoga.JUSTIFY_FLEX_END,
    [YogaJustifyContent.spaceBetween]: yoga.JUSTIFY_SPACE_BETWEEN,
    [YogaJustifyContent.spaceAround]: yoga.JUSTIFY_SPACE_AROUND,
    [YogaJustifyContent.evenly]: yoga.JUSTIFY_SPACE_EVENLY,
};
export type YogaJustifyContentValues = ValuesIn<typeof YogaJustifyContentValues>;


export const YogaFlexDirection = literalsEnum(
    'row',
    'rowReverse',
    'column',
    'columnReverse'
);
export type YogaFlexDirection = ExtractLiterals<typeof YogaFlexDirection>;
export const YogaFlexDirectionValues = {
    default: yoga.FLEX_DIRECTION_ROW,
    [YogaFlexDirection.row]: yoga.FLEX_DIRECTION_ROW,
    [YogaFlexDirection.rowReverse]: yoga.FLEX_DIRECTION_ROW_REVERSE,
    [YogaFlexDirection.column]: yoga.FLEX_DIRECTION_COLUMN,
    [YogaFlexDirection.columnReverse]: yoga.FLEX_DIRECTION_COLUMN_REVERSE
};
export type YogaFlexDirectionValues = ValuesIn<typeof YogaFlexDirectionValues>;
