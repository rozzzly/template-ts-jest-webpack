require('ts-node').register({
    // cache: true,
    compilerOptions: {
        module: 'commonjs',
        'jsxFactory': 'ink.h',
        typeRoots: [
            `./node_modules/@types`,
            `./stubs`
        ]
    }
});
require('./watch.ts');
