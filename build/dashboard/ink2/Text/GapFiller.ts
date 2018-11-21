import { SpanCoords } from '../Renderer/Coords';
import Style from './Style';
import { RowBuilder } from '../Renderer/GridRow';

export type GapFiller = (builder: RowBuilder, coords: SpanCoords,  parentStyle: Style) => void;
export const defaultGapFiller: GapFiller = (builder: RowBuilder, coords: SpanCoords, parentStyle: Style): void => {
    builder.append(parentStyle, whitespaceBuilder.substring(0, coords.x1 - coords.x0));
};
const whitespaceBuilder = ' '.repeat(32).repeat(32); // quick way of creating 1024 spaces
