import { SpanCoords } from './Coords';
import Style from '../Text/Style';
import RowBuilder from './RowBuilder';

export type GapFiller = (builder: RowBuilder, coords: SpanCoords, style: Style | null) => RowBuilder;
export const defaultGapFiller: GapFiller = (builder: RowBuilder, coords: SpanCoords, style: Style | null = null): RowBuilder => {
    const width = coords.x1 - coords.x0;
    const text = whitespaceBuilder.substring(0, width);
    if (style !== null) {
        return builder.styledText(style, text, width);
    } else {
        return builder.text(text, width);
    }
};
export default GapFiller;

const whitespaceBuilder = ' '.repeat(32).repeat(32); // quick way of creating 1024 spaces
