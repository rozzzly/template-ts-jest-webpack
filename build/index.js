require('ts-node').register({
    cache: true,
    compilerOptions: {
        module: 'commonjs',
        typeRoots: [
            `./node_modules/@types`,
            `./stubs`
        ]
    }
});
require('./watch.ts');
