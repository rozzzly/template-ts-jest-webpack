import * as path from 'path';
import * as webpack from 'webpack';
import * as express from 'express';
import * as wdm from 'webpack-dev-middleware';
import * as whm from 'webpack-hot-middleware';
import HookSuitePlugin from './HookSuitePlugin';
import chalk from 'chalk';
import sharedCfg from './webpack/shared';
import init from '../src/modules/app/server/entrypoint';

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

interface CompilerInitPhase {
    phase: 'init';
    compiler: webpack.Compiler;
    onDisk: false;
    started: number;
    finished: number;

    initTime: number;
}

interface CompilerBuildingPhase {
    phase: 'building';
    compiler: webpack.Compiler;
    started: number;
    finished: number;
    onDisk: boolean;

    initTime: number;
    warnings: [];
    errors: [];
}
interface CompilerSuccessPhase {
    phase: 'success';
    compiler: webpack.Compiler;
    started: number;
    finished: number;
    initTime: number;
    warnings: any[];
    errors: any[];
    onDisk: true;
}

interface CompilerFailurePhase {
    phase: 'failure';
    compiler: webpack.Compiler;
    started: number;
    finished: number;
    onDisk: boolean;

    initTime: number;
    errors: any[];
    warnings: any[];
}

export type CompilerHandle = (
    | CompilerInitPhase
    | CompilerBuildingPhase
    | CompilerSuccessPhase
    | CompilerFailurePhase
);

export type CompilerPhase = (
    | 'init'
    | 'building'
    | 'success'
    | 'failure'
);

function phaseShift(id: CompilerID, newPhase: 'building', args?: { }): void;
function phaseShift(id: CompilerID, newPhase: 'init', args: { compiler: webpack.Compiler }): void;
function phaseShift(id: CompilerID, newPhase: 'success' | 'failure', args: { warnings: any[], errors: any[] }): void;
function phaseShift(id: CompilerID, newPhase: CompilerPhase, args: { warnings?: any[], errors?: any[], compiler?: webpack.Compiler } = {}): void {
    let prevState: CompilerBuildingPhase = compilers[id] as CompilerBuildingPhase;
    switch (newPhase) {
        case 'init':
            compilers[id] = {
                phase: 'init',
                started: Date.now(),
                finished: -1,
                initTime: -1,
                onDisk: false,
                compiler: args.compiler as webpack.Compiler
            };
            break;
        case 'building':
            compilers[id] = {
                ...prevState,
                phase: 'building',
                initTime: ((prevState.initTime === -1)
                    ? Date.now() - prevState.started
                    : prevState.initTime
                ),
                started: Date.now(),
                finished: -1,
                warnings: [],
                errors: []
            };
            break;
        case 'success':
            compilers[id] = {
                ...prevState,
                phase: 'success',
                finished: Date.now(),
                warnings: args.warnings as any[],
                errors: args.errors as any[],
                onDisk: true,
            };
            break;
        case 'failure':
            compilers[id] = {
                ...prevState,
                phase: 'failure',
                finished: Date.now(),
                warnings: args.warnings as any[],
                errors: args.errors as any[],
            };
            break;
        default:
            throw new TypeError('Unexpected phase given');
            break;
    }
}

type CompilerID = (
    | 'shared'
    | 'client'
    | 'server'
);

let compilers: {
    [cid in CompilerID]: CompilerHandle
} = {
    shared: {} as CompilerInitPhase,
    client: {} as CompilerInitPhase,
    server: {} as CompilerInitPhase
 };


const buildNotif = (stats: webpack.Stats, id: string): void => {
    const duration = stats.toJson({chunks: false}).time;
    console.log(`${chalk.magenta(id)} built in ${chalk.greenBright(duration)}ms`);
};

const beforeRun = (compiler: webpack.Compiler, id: string): void => {
    phaseShift(id as CompilerID, 'building');
};


function launchStageTwo() {
    console.log('stage 2');
}

function launchStageOne() {
    phaseShift('shared', 'init', {
        compiler: webpack(sharedCfg.mutate({
            mode: 'production',
            hookSuite: new HookSuitePlugin({
                id: 'shared',
                beforeRun: beforeRun,
                onDone: buildNotif,
                afterFirstEmit() {
                    launchStageTwo();
                }

            })
        }))
    });
    compilers.shared.compiler.watch({}, () => { /* */ });
}

launchStageOne();