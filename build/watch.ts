import * as path from 'path';
import * as webpack from 'webpack';
import * as express from 'express';
import * as wdm from 'webpack-dev-middleware';
import * as whm from 'webpack-hot-middleware';
import HookSuitePlugin from './HookSuitePlugin';
import chalk from 'chalk';
import sharedCfg from './webpack/shared';

// require('source-map-support').install({
//     // hookRequire for inline-sourcemaps support:
//     hookRequire: true
// });

// const dllConfig = require('./webpack.dll')

// function launchServer(app, multiCompiler) {
//     setTimeout(() => {
//         console.log('loading server binary');
//         require('./bin/entrypoint.server.js')(app);
//         console.log('listening at :3000')
//     }, 1000);
// }

// const TRACKING_SYM = Symbol('TRACKING_SYM');


// function watchMain() {
//     console.log('starting main watcher!')
//     const clientConfig = require('./webpack.client');
//     const serverConfig = require('./webpack.server');
//     let clientCompiled = false;
//     let serverLaunched = false;
//     let serverCompiled = false;
//     const multiCompiler = webpack([clientConfig, serverConfig]);
//     multiCompiler.compilers[0].hooks.compilation.tap('VerifyBuild', (compilationParams) => {
//         compilationParams[TRACKING_SYM] = { beginTimestamp: Date.now() };
//         console.log(compilationParams);
//     });
//     multiCompiler.compilers[0].hooks.afterEmit.tap('VerifyBuild', (compilation: any) => {
//         console.log(compilation[TRACKING_SYM]);
//         console.log(Date.now() - compilation[TRACKING_SYM].beginTimestamp);
//         console.log(compilation);
//     });
//     const app = express();
//     const wdmInstance = new wdm(multiCompiler, {
//         serverSideRender: true,
//         writeToDisk: true
//     });
//     app.use(wdmInstance);
//     app.use(whm(multiCompiler, {

//     }));
//     console.log('express wdm/whm loaded');
//     multiCompiler.watch({}, (err, stats) => {
//         if (err) {
//             console.error(err)
//         } else if (stats.hasErrors() || stats.hasWarnings()) {
//             console.error(stats.hasErrors(), stats.hasWarnings());
//         } else {
//             const multiStats = stats.toJson({chunks: false});
//             if (multiStats.children.length == 2) {
//                 if (multiStats.children[0].name === 'client') {
//                     clientCompiled = true;
//                     console.info(`client built in ${multiStats.children[0].time}ms`);
//                 } else if (multiStats.children[0].name === 'server') {
//                     serverCompiled = true;
//                     console.info(`server built in ${multiStats.children[0].time}ms`);
//                 } else {
//                     console.error('unknown bundle built');
//                 }
//                 if (multiStats.children[1].name === 'client') {
//                     clientCompiled = true;
//                     console.info(`client built in ${multiStats.children[1].time}ms`);
//                 } else if (multiStats.children[1].name === 'server') {
//                     serverCompiled = true;
//                     console.info(`server built in ${multiStats.children[1].time}ms`);
//                 } else {
//                     console.error('unknown bundle built');
//                 }
//             } else if (multiStats.children.length === 1) {
//                 if (multiStats.children[0].name === 'client') {
//                     clientCompiled = true;
//                     console.info(`client built in ${multiStats.children[0].time}ms`);
//                 } else if (multiStats.children[0].name === 'server') {
//                     serverCompiled = true;
//                     console.info(`server built in ${multiStats.children[0].time}ms`);
//                 } else {
//                     console.error('unknown bundle built');
//                 }
//             } else {
//                 console.error('unknown bundle built');
//             }

//             if (!serverLaunched && clientCompiled && serverCompiled) {
//                 serverLaunched = true;
//                 launchServer(app, multiCompiler);
//             }
//         }
//     });
// }

type CompilerPhaseInit = {
    phase: 'init';
    onDisk: false;
    started: 0;
    finished: 0;
};


type CompilerPhaseBuilding = {
    phase: 'building';
};
type CompilerPhaseSuccess = {
    phase: 'success';
    warnings: any[];
    onDisk: true;
};

type CompilerPhaseFailure= {
    phase: 'failure';
    errors: any[];
    warnings: any[];
};
type CompilerHandle = (
    & {
        compiler: webpack.Compiler;
        onDisk: false;
        started: number;
        finished: number;
    }
    & (
        | CompilerPhaseInit
        | CompilerPhaseBuilding
        | CompilerPhaseSuccess
        | CompilerPhaseFailure
    &
    &
);

let compilers: {
    shared?: CompilerHandle
    client?: CompilerHandle,
    server?: CompilerHandle
} = { };


const buildNotif = (stats: webpack.Stats, id: string) => {
    const duration = stats.toJson({chunks: false}).time;
    console.log(`${chalk.magenta(id)} built in ${chalk.greenBright(duration)}ms`);
};



function launchStageTwo() {
    console.log('stage 2');
}

function launchStageOne() {
    compilers.shared = {
        status: 'init',
        onDisk: false,
        started: 0,
        finished: 0,
        compiler: webpack(sharedCfg.mutate({
            mode: 'production',
            hookSuite: new HookSuitePlugin({
                id: 'shared',
                onDone: buildNotif,
                afterFirstEmit() {
                    launchStageTwo();
                }

            })
        }))
    };
    compilers.shared.watch({}, () => { /* */ });
}

launchStageOne();