import { Style, baseStyle, StyleOverride } from './Style';

class RowBuilder {
    public precedingStyle: Style;
    public parentStyle: Style | null;
    public width: number;
    private pieces: string[];
    private dirty: boolean;
    public constructor() {
        this.precedingStyle = baseStyle;
        this.pieces = [];
        this.width = 0;
    }

    public append(style: Style | StyleOverride, text: string, width: number): void {
        if (Style.isStyle(style)) {

        } else {
            const nextStyle = (this.parentStyle) ? this.parentStyle.override(style) : this.precedingStyle.override(style);
            if (this.precedingStyle !== nextStyle) { // quick referential test to skip generating codes for idempotent overrides
                this.pieces.push(nextStyle.code(this.precedingStyle), text);
                this.precedingStyle = nextStyle;
            } else {
                this.pieces.push(text);
            }
        } else {
            const foo = style;
        }
        this.width += width;
    }
}
