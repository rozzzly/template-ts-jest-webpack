import * as codes from './TextStyle/AnsiCodes';
import { OwnStyle, baseStyleData } from './TextStyle/TextStyle';
import { TextChunk } from './TextChunk';
import { inRange } from '../misc';
import { TextColorMode, TextColor } from './TextStyle/TextColor';

const newlineRegex: RegExp = /\r?\n/g;
const ansiStyleRegex: RegExp = /(\u001b\[(?:\d+;)*\d+m)/u;
export const ansiStyleParamsRegex: RegExp = /\u001b\[((?:\d+;)*\d+)m/u;
export const stripAnsiEscapes = (str: string): string => (
    str.split(ansiStyleRegex).reduce((reduction, part) => (
        ansiStyleRegex.test(part) ? reduction : reduction + part
    ), '')
);
export function normalize(raw: string): string {
    return raw.normalize('NFC');
}

export function parse(str: string) {
    const normalized = normalize(str);
    const chunks: TextChunk[] = [];
    let style: OwnStyle = {};

    let escape: RegExpExecArray | null;
    const parts: string[] = normalized.split(ansiStyleRegex); // separate plaintext and escape sequences
    let escapes: number[][] = [];
    parts.forEach((part: string, index: number) => {
        if (part === '') return; // `return` is poor-man's continue
        else {
            if (escape = ansiStyleParamsRegex.exec(part)) { // SR
                let params: number[] = escape[1].split(';').map(Number);
                while (params.length) {
                    let current: number = params.pop()!;
                    if (inRange(codes.FG_START, codes.FG_DEFAULT, current) || inRange(codes.FG_BRIGHT_START, codes.FG_BRIGHT_END, current)) {
                        style.fgColor = new TextColor(current, TextColorMode.Ansi16);
                    } else if (inRange(codes.BG_START, codes.BG_DEFAULT, current) || inRange(codes.BG_BRIGHT_START, codes.BG_BRIGHT_END, current)) {
                        style.bgColor = new TextColor(current, TextColorMode.Ansi16);
                    } else if (current === codes.WEIGHT_BOLD) {
                        style.weight = 'bold';
                    } else if (current === codes.WEIGHT_FAINT) {
                        style.weight = 'faint';
                    } else if (current === codes.WEIGHT_NORMAL) {
                        style.weight = 'normal';
                    } else if (current === codes.WEIGHT_BOLD_OFF && style.weight === 'bold') {
                        // wiki article says 'bold off' but doesn't specify if it disabled faint as well,
                        // so for now, don't do anything if current weight is not `bold`
                        style.weight = 'bold';
                    } else if (current === codes.ITALIC_ON) {
                        style.italic = true;
                    } else if (current === codes.ITALIC_OFF) {
                        style.italic = false;
                    } else if (current === codes.UNDERLINED_ON) {
                        style.underline = true;
                    } else if (current === codes.UNDERLINED_OFF) {
                        style.underline = false;
                    } else if (current === codes.INVERTED_ON) {
                        style.inverted = true;
                    } else if (current === codes.INVERTED_OFF) {
                        style.inverted = false;
                    } else if (current === codes.STRIKED_ON) {
                        style.strike = true;
                    } else if (current === codes.STRIKED_OFF) {
                        style.strike = false;
                    } else if (current === codes.RESET) {
                        style = { ...baseStyleData };
                    } else if (current === codes.FG_CUSTOM) {
                        const mode = params.pop();
                        if (mode === codes.COLOR_MODE_ANSI_256) {
                            style.fgColor = new TextColor(params.pop()!, TextColorMode.Ansi256);
                        } else if (mode === codes.COLOR_MODE_RGB) {
                            style.fgColor = new TextColor([
                                params.pop()!,
                                params.pop()!,
                                params.pop()!
                            ]);
                        } else {
                            throw new TypeError('Malformed custom text color');
                        }
                    } else if (current === codes.BG_CUSTOM) {
                        const mode = params.pop();
                        if (mode === codes.COLOR_MODE_ANSI_256) {
                            style.bgColor = new TextColor(params.pop()!, TextColorMode.Ansi256);
                        } else if (mode === codes.COLOR_MODE_RGB) {
                            style.bgColor = new TextColor([
                                params.pop()!,
                                params.pop()!,
                                params.pop()!
                            ]);
                        } else {
                            throw new TypeError('Malformed custom text color');
                        }
                    } else {
                        throw new TypeError(`Unsupported ANSI escape code SGR parameter: '${current}' in '${safeParams}'.`);
                    }

                }
            } else {
                if (!escapes.length) { // this should be a `PlainTextChunkNode`
                    root.children.push(new PlainTextSpanNode(root, part));
                } else {
                    // there are unhandled escapes, but is part has the "base" style. Let's just attach these escapes to the previous `AnsiTextChunkNode`
                    if (style.equalTo(baseStyle) && rc.isLastNodeOfKind('AnsiTextSpanNode')) {
                        const previous: AnsiTextSpanNode = rc.last();
                        // create `AnsiEscapeNodes` and attach them to previous `AnsiTextChunkNode`
                        const escapeNodes: AnsiEscapeNode[] = escapes.map(params => (
                            new AnsiEscapeNode(previous, params)
                        ));
                        previous.children.push(...escapeNodes);
                        root.children.push(new PlainTextSpanNode(root, part));
                        escapes = [];
                        style = style.clone();
                    } else {
                        const node: AnsiTextSpanNode = new AnsiTextSpanNode(root, part, style);
                        const escapeNodes: AnsiEscapeNode[] = escapes.map(params => (
                            new AnsiEscapeNode(node, params)
                        ));
                        // put existing escapes before content
                        node.children.unshift(...escapeNodes);
                        root.children.push(node);
                        escapes = [];
                        style = style.clone(); // prevent mutation
                    }
                }
            }
        }
    });
    root.build();

    return root;
}