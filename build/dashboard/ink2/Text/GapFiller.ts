import RectCoords, { LineCoords } from '../Renderer/Coords';
import Style from './Style';
import GridRow from '../Renderer/GridRow';

export type GapFiller = (coords: LineCoords, row: GridRow, parentStyle: Style) => void;
export const defaultGapFiller: GapFiller = (coords: LineCoords, row: GridRow, parentStyle: Style): void => {
    row.write(parentStyle, whitespaceBuilder.substring(0, coords.x1 - coords.x0));
};
const whitespaceBuilder = ' '.repeat(32).repeat(32); // quick way of creating 1024 spaces
