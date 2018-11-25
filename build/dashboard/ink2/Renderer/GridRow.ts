import { NodeInstance, NodeKind } from '../Tree';
import Style from '../Text/Style';
import RenderGrid from './RenderGrid';
import { SpanCoords, ColumnRange } from './Coords';

export class RowBuilder {
    private precedingStyle: Style;
    private buff: string[];

    public constructor() {
        this.precedingStyle = Style.base;
        this.buff = [];
    }

    public append(style: Style, text: string): void {
        this.buff.push(style.code(this.precedingStyle), text);
        this.precedingStyle = style;

    }

    public toString(): string {
        this.buff.push(Style.resetCode, '\r\n');
        return this.buff.join('');
    }
}

export interface GridSpan extends SpanCoords {
    derivedFrom: GridSpan | null;
    node: NodeInstance;
}

export class GridRow {
    public grid: RenderGrid;
    public y: number;
    public width: number;
    public text: string | null;
    public spans: GridSpan[];

    public constructor(grid: RenderGrid, y: number) {
        this.grid = grid;
        this.width = this.grid.width;
        this.y = y;
        this.spans = [
            {
                x0: 0,
                x1: this.width,
                y: this.y,
                node: this.grid.root,
                derivedFrom: null
            }
        ];
        this.text = null;
    }

    public plot(node: NodeInstance, { x0, x1 }: ColumnRange) {
        const nSpan = {
            node,
            x0,
            x1,
            y: this.y,
            derivedFrom: null
        };
        if (nSpan.x0 < 0 || nSpan.x1 > this.width) {
            throw new RangeError();
        } else {
            let nSpans: GridSpan[] = [];
            for (let cSpan, i = 0; cSpan = this.spans[i]; i++) {
                /**
                 * Do you know what time it is?? ..
                 *      - IT'S DIAGRAM TIME!!
                 * That's right kids! I can't visualize this in my head so it's for my benefit really,
                 * but maybe it will help you too
                 *
                 * Legend:
                 *      -: content of existing, unmodified span
                 *      =: content partial content from existing span
                 *      $: content of new span
                 *      @: denotes separation between spans
                 *
                 * For brevity's sake, the state of `this.spans` prior to `this.write(...)` is
                 * omitted-unless otherwise stated-it can be assumed to consist of 3 spans each with a
                 * width of 4 so the diagram would look like:
                 *
                 * ----@----@----
                 *
                 * in memory, `this.spans` would look like:
                 *
                 * [0] = { x0: 0, x1: 4, derivedFrom: null, node: ...  }
                 * [1] = { x0: 4, x1: 8, derivedFrom: null, node: ... }
                 * [2] = { x0: 8, x1: 12, derivedFrom: null, node: .... }
                 *
                 * after calling write(offset: 0, width: 2) the diagram and memory would be
                 *
                 * $$@==@----@----
                 *
                 * [0] = { x0: 0, x1: 2, derivedFrom: null, node: ...  }
                 * [1] = { x0: 2, x1: 4, derivedFrom: { x0: 0, x1: 4, derivedFrom: null, node: ...  }, node: ...  }
                 * [2] = { x0: 4, x1: 8, derivedFrom: null, node: ... }
                 * [3] = { x0: 8, x1: 12, derivedFrom: null, node: .... }
                 *
                 ***************************************************************************************************
                 ***************************************************************************************************
                 *
                 *  Scenarios:
                 *      [Skip] nSpan starts after cSpan ends
                 *          NOTE ::: using >= because x0 is inclusive while x1 is exclusive
                 *          Test: nSpan.x0 >= cSpan.x1
                 *          Effect:
                 *              cSpan is appended to nSpans without modification                 *
                 *          Examples:
                 *              write(offset: 4, width: 2) --> [Skip] when i === 0
                 *               ----@$$@==@----
                 *              write(offset: 9, width: 3) --> [Skip] when i === 0 || i === 1
                 *              ----@----@=@$$$
                 *      [End] nSpan ends after cSpan begins
                 *          Test: nSpan.x1 <= cSpan.x0
                 *          Effect:
                 *              cSpan is append without modification
                 *              any spans following cSpan are appended without modification
                 *              iteration is aborted (via break;)
                 *          Examples:
                 *              write(offset: 3, width: 4) --> [End] when i === 2
                 *              ===@$$$@==@----
                 *              write(offset: 2, width: 2) --> [End] when i === 1 (iteration aborted prematurely)
                 *              ==@$$@----@----
                 *      [Extends] nSpan ends after cSpan does
                 *          Test: nSpan.x1 > cSpan.x1
                 *          Effects: none (cSpan is no appended, but nSpan will be in following iteration(s))
                 *          Examples:
                 *              ----@$$$$$$@-- write(4, 6) when i === 1 (when i === 2: [ClipRight])
                 *              ---@$@$$$$$$@-- write(4, 7) when i === 1 (when i === 0: [ClipLeftExtends], i === 2: [ClipRight])
                 *      [Flush] nSpan ends where cSpan does
                 *          Test: xSpan.x1 === cSpan.x1
                 *      [ClipLeft] nSpan start after cSpan starts
                 *          Test: nSpan.x0 > cSpan.x0
                 *      [ClipLeftFlush] nSpan ends where cSpan does, but begins after cSpan starts
                 *          Test: [ClipLeft] && [Flush]
                 *              left-clipped version of cSpan is appended to nSpans
                 *              nSpan is appended to nSpans
                 *              any remaining spans are appended and iteration aborted (similar to [End])
                 *          Examples:
                 *              ----@=@$$$@---- write(5, 3) when i === 1
                 *      [ClipLeftExtends] nSpan ends after cSpan does but begins before cSpan does
                 *          Test: [ClipLeft] && nSpan.x1 > cSpan.x1
                 *          Effects:
                 *              left-clipped version of cSpan is appended to nSpans
                 *          Examples:
                 *              ----@=@$$$@---- write(5, 3) when i === 1
                 *              ----@=@$$$$$$@- write(5, 6) when i === 1
                 *      [ClipRight] nSpan ends before cSpan ends
                 *          Test: nSpan.x1 < cSpan.x1
                 *          Effects:
                 *              nSpan is appended
                 *              right-clipped version of cSpan is appended
                 *              any remaining spans are appended and iteration aborted (similar to [End])
                 *          Examples:
                 *              ----@$$$@=@---- write(4, 3) when i === 1
                 *              $$$$$$$@=@---- write(0, 7) when i === 1 (when i === 0: [Extends])
                 *              ----@----@$@=== write(8, 1) when i === 2
                 *      [ClipBoth]
                 *          Test: [ClipLeft] && [ClipRight]
                 *          Effects:
                 *              left-clipped version of cSpan appended
                 *              nSpan is appended
                 *              right-clipped version of cSpan is appended
                 *              any remaining spans are appended and iteration aborted (similar to [End])
                 *          Examples:
                 *              ----@=@$$@=@---- write(5, 2) when i === 1
                 *              =@$@==@----@---- write(1, 1) when i === 0
                 *      [Fill] nSpan ends where cSpan does but is not left-clipped
                 *          Test: nSpan.x0 <= cSpan.x0 && [Flush]
                 *          Effects:
                 *              nSpan is appended
                 *              any remaining spans are appended and iteration aborted (similar to [End])
                 *          Examples:
                 *              ---@$@$$$$@---- write(3, 5) when i === 1 (when i === 0: ClipLeftExtends)
                 *              $$$$@----@---- write(0, 4)
                 */
                if (nSpan.x0 >= cSpan.x1) nSpans.push(cSpan); // [Skip]
                else {
                    if (nSpan.x1 <= cSpan.x0) { // [End]
                        nSpans = nSpans.concat(this.spans.slice(i));
                        break; // abort prematurely
                    } else {
                        if (nSpan.x1 === cSpan.x1) { // [ClipLeftFlush] | [Fill]
                            if (nSpan.x0 <= cSpan.x0) { // [Fill]
                                nSpans = nSpans.concat(nSpan, this.spans.slice(i + 1));
                                break; // abort prematurely
                            } else { // [ClipLeftFlush]
                                nSpans = nSpans.concat(
                                    {
                                        ...cSpan,
                                        derivedFrom: cSpan,
                                        x1: nSpan.x0
                                    },
                                    nSpans,
                                    this.spans.slice(i + 1)
                                );
                                break; // abort prematurely
                            }
                        } else if (nSpan.x1 > cSpan.x1) { // [Extends] | [ClipLeftExtends]
                            if (nSpan.x0 > cSpan.x0) { // [ClipLeftExtends]
                                nSpans.push({
                                    ...cSpan,
                                    derivedFrom: cSpan,
                                    x1: nSpan.x0
                                });
                            } // else [Extends] (continue)
                        } else { // [ClipRight] | [ClipBoth]
                            if (nSpan.x0 > cSpan.x0) { // [ClipBoth]
                                nSpans = nSpans.concat(
                                    {
                                        ...cSpan,
                                        derivedFrom: cSpan,
                                        x1: nSpan.x0
                                    },
                                    nSpan,
                                    {
                                        ...cSpan,
                                        derivedFrom: cSpan,
                                        x0: nSpan.x1
                                    },
                                    this.spans.slice(i + 1)
                                );
                                break; // abort prematurely
                            } else { // [ClipRight]
                                nSpans = nSpans.concat(
                                    nSpan,
                                    {
                                        ...cSpan,
                                        derivedFrom: cSpan,
                                        x0: nSpan.x1
                                    },
                                    this.spans.slice(i + 1)
                                );
                                break; // abort prematurely
                            }
                        }
                    }
                }
            }
            this.spans = nSpans;
        }
    }

    public render(): string {
        this.text = null;
        const builder = new RowBuilder();
        for (let span, i = 0; span = this.spans[i]; i++) {
            span.node.renderContainer.render(builder, span);
        }
        this.text = builder.toString();
        return this.text;
    }
}
export default GridRow;
