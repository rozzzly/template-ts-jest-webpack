import { TextStyle, OwnStyle } from './TextStyle/TextStyle';

export const RawToChunksCache = new Map<string, TextChunk[]>();

/// TODO ::: find a better (real) LRU cache eviction mechanism
setInterval(() => RawToChunksCache.clear(), 1000 * 60 * 3);

export class TextChunk {
    public readonly raw: string;
    public readonly style: OwnStyle;
}