const path = require('path');
const webpack = require('webpack');
const express = require('express');
const wdm = require('webpack-dev-middleware');
const whm = require('webpack-hot-middleware');

// require('source-map-support').install({
//     // hookRequire for inline-sourcemaps support:
//     hookRequire: true
// });

const dllConfig = require('./webpack.dll')

function launchServer(app, multiCompiler) {
    setTimeout(() => {
        console.log('loading server binary');
        require('./bin/entrypoint.server.js')(app);
        console.log('listening at :3000')
        
    }, 1000);
}

const TRACKING_SYM = Symbol('TRACKING_SYM');

function watchMain() {
    console.log('starting main watcher!')
    const clientConfig = require('./webpack.client');
    const serverConfig = require('./webpack.server');
    let clientCompiled = false;
    let serverLaunched = false;
    let serverCompiled = false;
    const multiCompiler = webpack([clientConfig, serverConfig]);
    multiCompiler.compilers[0].hooks.compilation.tap('VerifyBuild', (compilationParams) => {
        compilationParams[TRACKING_SYM] = { beginTimestamp: Date.now() };
        console.log(compilationParams);
    });
    multiCompiler.compilers[0].hooks.afterEmit.tap('VerifyBuild', (compilation) => {
        console.log(compilation[TRACKING_SYM])
        console.log(Date.now() - compilation[TRACKING_SYM].beginTimestamp)
        console.log(compilation);
    });
    const app = express();
    const wdmInstance = new wdm(multiCompiler, {
        serverSideRender: true,
        writeToDisk: true
    });
    app.use(wdmInstance);
    app.use(whm(multiCompiler, {

    }));
    console.log('express wdm/whm loaded');
    multiCompiler.watch({}, (err, stats) => {
        if (err) {
            console.error(err) 
        } else if (stats.hasErrors() || stats.hasWarnings()) {
            console.error(stats.hasErrors(), stats.hasWarnings());
        } else {
            const multiStats = stats.toJson({chunks: false});
            if (multiStats.children.length == 2) {
                if (multiStats.children[0].name === 'client') {
                    clientCompiled = true;
                    console.info(`client built in ${multiStats.children[0].time}ms`);
                } else if (multiStats.children[0].name === 'server') {
                    serverCompiled = true;
                    console.info(`server built in ${multiStats.children[0].time}ms`);
                } else {
                    console.error('unknown bundle built');
                }
                
                if (multiStats.children[1].name === 'client') {
                    clientCompiled = true;
                    console.info(`client built in ${multiStats.children[1].time}ms`);
                } else if (multiStats.children[1].name === 'server') {
                    serverCompiled = true;
                    console.info(`server built in ${multiStats.children[1].time}ms`);
                } else {
                    console.error('unknown bundle built');
                }
            } else if (multiStats.children.length === 1) {
                if (multiStats.children[0].name === 'client') {
                    clientCompiled = true;
                    console.info(`client built in ${multiStats.children[0].time}ms`);
                } else if (multiStats.children[0].name === 'server') {
                    serverCompiled = true;
                    console.info(`server built in ${multiStats.children[0].time}ms`);
                } else {
                    console.error('unknown bundle built');
                }
            } else {
                console.error('unknown bundle built');                
            }

            if (!serverLaunched && clientCompiled && serverCompiled) {
                serverLaunched = true;
                launchServer(app, multiCompiler);
            }
        }
    });
}



async function launch() {
    
    let dllCompiled = false;
    const dllCompiler = webpack(dllConfig);
    // let dllReady = false;
    dllCompiler.hooks.afterEmit.tap('DelayedStart', (compilationParams) => {
        if (!dllCompiled) {
            dllCompiled = true;
            watchMain();
        }
    })
    dllCompiler.watch({}, (err, stats) => {
        if (err) {
            console.error(err) 
        } else {
            console.log(`dll built in ${stats.toJson({chunks: false}).time}ms`);
        }
    });

    // const multiCompiler = webpack([clientConfig, serverConfig]);
    // const wdmInstance = new wdm(multiCompiler, {
    //     serverSideRender: true,
    //     writeToDisk: true
    // });
    // app.use(wdmInstance);
    // app.use(whm(multiCompiler, {

    // }));
    // app.listen(3000); 
    //let failed = false;
    // try {
    //     await new Promise(resolve => {
    //         const compiler = webpack(serverConfig);
    //         compiler.watch({ /*filename: serverBin */}, (err, stats) => {
    //             if (err) {
    //                 console.error(err);
    //                 reject(err);
    //             } else {
    //                 ///console.info(stats);
    //                 resolve(stats);
    //             }
    //         });
    //     });
    // } catch (e) {
    //     failed = true;
    //     console.error('compilation failed', e);
    // }

    // if (!failed) {
    //     try {
    //         require(serverBin)(app);
    //         app.listen(3000);
    //     } catch(e) {
    //         console.error('compilation failed', e);
    //     }
    // } else {
    //     process.exit(-1);
    // }
};

launch();