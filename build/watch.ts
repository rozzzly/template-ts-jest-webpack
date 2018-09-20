import * as path from 'path';
import * as webpack from 'webpack';
import * as express from 'express';
import * as wdm from 'webpack-dev-middleware';
import * as whm from 'webpack-hot-middleware';
import HookSuitePlugin, { HookSuiteBridgePlugin } from './dashboard/HookSuitePlugin';
import chalk from 'chalk';
import sharedCfg from './webpack/shared';
import init from '../src/modules/app/server/entrypoint';
import Tracker from './dashboard/Tracker';


const buildNotif = (stats: webpack.Stats, id: string): void => {
    const duration = stats.toJson({chunks: false}).time;
    console.log(`${chalk.magenta(id)} built in ${chalk.greenBright(duration)}ms`);
};


function launchStageTwo() {
    console.log('stage 2');
}

const tracker = new Tracker([ 'shared' ]);

function launchStageOne() {
    const sharedCompiler = webpack(sharedCfg.mutate({
        mode: 'production',
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

launchStageOne();
