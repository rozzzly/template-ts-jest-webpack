import * as path from 'path';
import * as webpack from 'webpack';
import * as express from 'express';
import * as wdm from 'webpack-dev-middleware';
import * as whm from 'webpack-hot-middleware';
import clientCfg from './webpack/client';
import sharedCfg from './webpack/shared';
import serverCfg from './webpack/server';
// import init from '../src/modules/app/server/entrypoint';
import CompilerTrackerPlugin from './dashboard/CompilerTrackerPlugin';
import { configProxy } from './util';
import render from './dashboard/ui';
import { PUBLIC_PATH } from './constants';
import store from './dashboard/store';


const configs = {
    shared: configProxy(sharedCfg, {
        hmr: false,
        hookSuite: new CompilerTrackerPlugin({
            id: 'shared',
            store,
            afterFirstEmit() {
                launchStageTwo();
            }
        })
    }),
    client: configProxy(clientCfg, {
        hmr: false,
        hookSuite: new CompilerTrackerPlugin({
            id: 'client',
            store
        })
    }),
    server: configProxy(serverCfg, {
        hmr: false,
        hookSuite: new CompilerTrackerPlugin({
            id: 'server',
            store
        })
    })
};

let ready: number = 0;
function onReady() {
    ready++;
    if (ready >= 3) {
        (global as any).window = {}; // stub window
        require('./bin/runtime.shared.js');
        require('./bin/app.shared.js');
        require('./bin/frontend.shared.js');
        require('./bin/entrypoint.server.js')(app);
    }
}
let app: express.Application;
const noop =  (): any => { /* noop */ };
const noopLogger = {
    debug: noop,
    info: noop,
    error: noop,
    warn: noop,
    trace: noop,
    methodFactory: noop,
    getLevel: () => 0 as 0,
    getLogger: () =>  noopLogger,
    disableAll: noop,
    enableAll: noop,
    noConflict: noop,
    setLevel: noop,
    setDefaultLevel: noop,
    levels: {
        TRACE: 0 as 0,
        DEBUG: 1 as 1,
        INFO: 2 as 2,
        WARN: 3 as 3,
        ERROR: 4 as 4,
        SILENT: 5 as 5
    }
};
let multiCompiler: webpack.MultiCompiler;
function launchStageTwo() {
    multiCompiler = webpack([ configs.client, configs.server ]);
    app = express();
    const wdmInstance = wdm(multiCompiler, {
        writeToDisk: true,
        serverSideRender: true,
        publicPath: PUBLIC_PATH,
        stats: false, // disables outputting stats,
        logger: noopLogger,
        reporter: noop
    });
    app.use(wdmInstance);
    app.use(whm(multiCompiler, {
        log: false
    }));

    multiCompiler.watch({}, () => { /* */ });
}

function launchStageOne() {
    const sharedCompiler = webpack(configs.shared);
    sharedCompiler.watch({}, () => { /* */ });
}
render();
launchStageOne();
