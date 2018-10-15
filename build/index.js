
const wslPathRegExp = /\/mnt\/c\/Users\//g;
function isWSL() {
    return wslPathRegExp.test(__filename);
}

if (isWSL()) {
    const Chalk = require('chalk').default;
    process.on('uncaughtException', (error) => {
        let str = Chalk.red(error.message + '\n' + error.stack);
        str = str.replace(wslPathRegExp, 'C:/Users/');
        console.error(str);
        process.exit(-1);
    });
}


require('ts-node').register({
    // cache: true,
    project: __dirname+'/tsconfig.json'
});
require('./watch.ts');
