require('ts-node').register({
    // cache: true,
    project: __dirname+'/tsconfig.json'
});
require('./watch.ts');
