import { SpanCoords } from '../Renderer/Coords';
import Style from './Style';
import { RowBuilder } from '../Renderer/GridRow';

export type GapFiller = (builder: RowBuilder, coords: SpanCoords, style: Style | null) => void;
export const defaultGapFiller: GapFiller = (builder: RowBuilder, coords: SpanCoords, style: Style | null = null): void => {
    const width = coords.x1 - coords.x0;
    const text = whitespaceBuilder.substring(0, width);
    if (style !== null) {
        builder.styledText(style, text, width);
    } else {
        builder.text(text, width);
    }
};

const whitespaceBuilder = ' '.repeat(32).repeat(32); // quick way of creating 1024 spaces
