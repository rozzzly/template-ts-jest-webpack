const path = require('path');
const webpack = require('webpack');
const express = require('express');
// const wdm = require('webpack-dev-middleware');
// const whm = require('webpack-hot-middleware');

// require('source-map-support').install({
//     // hookRequire for inline-sourcemaps support:
//     hookRequire: true
// });

const dllConfig = require('./webpack.dll')
//const serverConfig = require('./webpack.server');

async function watchMain() {
    console.log('starting main watcher!')
    const clientConfig = require('./webpack.client');
    const multiCompiler = webpack(clientConfig);
    multiCompiler.watch({}, (err, stats) => {
        if (err) {
            console.error(err);
        } else {
            console.log(stats.toString({ colors: true }));
            console.log('client built!')
        }
    });
}



async function launch() {
    // const app = express();
    
    const dllCompiler = webpack(dllConfig);
    // let dllReady = false;
    dllCompiler.watch({}, (err, stats) => {
        if (err) {
            console.error(err) 
        } else {
            console.log(stats.toString({ colors: true }));
            console.log('dll built!')
        }
    });
    setTimeout(watchMain, 15000);

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