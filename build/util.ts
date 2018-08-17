import { join } from 'path';
import { Options } from 'webpack';

export type ChunkGroupsShortForm = {
    [chunkName: string]: Options.CacheGroupsOptions['test']
};

export type ChunkGroupsFullForm = {
    [chunkName: string]: Options.CacheGroupsOptions;
};

export function createCacheGroups(shortForms: ChunkGroupsShortForm): ChunkGroupsFullForm {
    const chunks: Options.SplitChunksOptions['cacheGroups'] = {};
    Object.keys(shortForms).forEach(chunkName => {
        chunks[chunkName] = {
            chunks: 'all',
            name: chunkName,
            test: shortForms[chunkName]
        };
    });
    return chunks;
}

export { join };