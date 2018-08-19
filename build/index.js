require('ts-node').register({
    cache: true,
    compilerOptions: {
        module: 'commonjs'
    }
});
require('./watch.ts');