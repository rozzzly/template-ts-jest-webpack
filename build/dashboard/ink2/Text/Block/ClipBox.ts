import { Block } from '.';
import { literalsEnum, ExtractLiterals } from '../../misc';
import { Style } from '../Style';


export const TextAlign = literalsEnum(
    'left',
    'center',
    'right'
);

export type TextAlign = ExtractLiterals<typeof TextAlign>;

export class ClipBox {

    public parentStyle: Style;
    public gapFiller: GapFiller;
    public align: TextAlign;
    public block: Block;

    public width: number;
    public height: number;

    public xOffset: number;
    public yOffset: number;

    public renderLine(index: number, precedingStyle: Style) {
        if (index >= 0 && index < this.height) { // check if req index is within clipBox
            const blockLineIndex = index - this.yOffset;
            if (blockLineIndex < 0 || blockLineIndex  >= this.block.height) {
                return this.gapFiller(this.width, this.parentStyle, precedingStyle, {});
            } else {
                const line = this.block.lines[blockLineIndex];

                if (line.width === 0 || this.xOffset > this.width) { // empty line or visible text begins after clipBox's right edge
                    return this.gapFiller(this.width, this.parentStyle, precedingStyle, {});
                } else {
                    // find required left padding needed when text is aligned to right/center
                    let alignmentOffset = 0;
                    if (this.align === TextAlign.right) {
                        alignmentOffset = this.block.width - line.width;
                    } else if (this.align === TextAlign.center) {
                        alignmentOffset = Math.floor((this.block.width - line.width) / 2.0);
                    }

                    if (this.xOffset + alignmentOffset + line.width <= 0) { // visible text ends before clipBox's left edge
                        return this.gapFiller(this.width, this.parentStyle, precedingStyle, {});
                    } else {
                        let lastStyle = precedingStyle;
                        const buff = [];
                        const leftGap = this.xOffset + alignmentOffset;
                        if (leftGap) {

                        }

                    }
                }
            }
            //
            // translate clipBox index to block line index:
            //      clipBoxIndex(1) - yOffset(-2) = blockLineIndex(3)
            //
            //  leftPadding(leftAlign)
            //
            //
            //  clipBox.xOffset: 2          clipBox.xOffset: -4
            //  clipBox.yOffset: -2         clipBox.yOffset: 2
            //  clipBox.width: 6            clipBox.width: 6
            //  clipBox.height: 4           clipBox.height: 4
            //  clipBox.align: center       clipBox.align: left
            //  block.width: 8              block.width: 8
            //  block.height: 4             block.height: 4
            //
            //   -2    xxxxxxxx                0123456 -2
            //   -1 .__xxxxxxxx               .______. -1
            //    0 |  xxxxxxxx               |      |  0
            //  > 1 |  ooxxxxoo               |      |  1
            //    2 |      |...            oooooxxx  |..2
            //    3 |______|...            xxxxxxxx__|. 3
            //       0123456789            xxxxxxxx
            //                             xxxxxxxx
            //
            //
        } else {
            throw new RangeError();
        }

    }

}
export interface RenderLocation {
    // globalX: number;
    // globalY: number;
    // blockX: number;
    // blockY: number;
    // blockOffsetX: number;
    // blockOffsetY: number;
}
export type GapFiller = (width: number, parentStyle: Style, precedingStyle: Style, location: RenderLocation) => [Style, string];
export const defaultGapFiller: GapFiller = (width, parent, preceding) => {
    return [parent, parent.code(preceding) + whitespaceBuilder.substring(0, width)];
};
const whitespaceBuilder = ' '.repeat(32).repeat(32); // quick way of creating 1024 spaces
