import * as path from 'path';
import * as webpack from 'webpack';
import * as express from 'express';
import * as wdm from 'webpack-dev-middleware';
import * as whm from 'webpack-hot-middleware';
import HookSuitePlugin, { HookSuiteBridgePlugin } from './dashboard/HookSuitePlugin';
import chalk from 'chalk';
import clientCfg from './webpack/client';
import sharedCfg from './webpack/shared';
import serverCfg from './webpack/server';
// import init from '../src/modules/app/server/entrypoint';
import Tracker from './dashboard/Tracker';
import { configProxy } from './util';
import render from './dashboard/ui';


const buildNotif = (stats: webpack.Stats, id: string): void => {
    const duration = stats.toJson({chunks: false}).time;
    console.log(`${chalk.magenta(id)} built in ${chalk.greenBright(duration)}ms`);
};


function launchStageTwo() {
    const sharedCompiler = webpack([configProxy(clientCfg, {
        hookSuite: new HookSuiteBridgePlugin({
            id: 'client',
            tracker: tracker
        })
    }), configProxy(serverCfg, {
        hookSuite: new HookSuiteBridgePlugin({
            id: 'server',
            tracker: tracker
        })
    })]);
    sharedCompiler.watch({}, () => { /* */ });
}

const tracker = new Tracker([ 'shared', 'client', 'server' ]);

function launchStageOne() {
    const sharedCompiler = webpack(configProxy(sharedCfg, {
        hookSuite: new HookSuiteBridgePlugin({
            afterFirstEmit() {
                launchStageTwo();
            },
            id: 'shared',
            tracker: tracker
        })
    }));
    sharedCompiler.watch({}, () => { /* */ });
}

render(tracker);
launchStageOne();
