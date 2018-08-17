import { join } from './util';

export const ROOT_DIR = join(__dirname, '..');
export const SRC_DIR = join(ROOT_DIR, 'src');
export const BIN_DIR = join(ROOT_DIR, 'bin');
export const NODE_MODULES_REGEX = /[\\/]node_modules[\\/]/;
export const CACHE_GROUPS = {
    client: {
        app: /[\\/]src[\\/]modules[\\/]app[\\/]client[\\/]/,
        vendor: NODE_MODULES_REGEX
    },
    shared: {
        app: /[\\/]src[\\/]modules[\\/]app[\\/]shared[\\/]/,
        frontend: /[\\/]src[\\/]modules[\\/]frontend[\\/]/
    },
    server: {
        app: /[\\/]src[\\/]modules[\\/]app[\\/]server[\\/]/
    }
};
