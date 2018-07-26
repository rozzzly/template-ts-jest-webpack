const path = require('path');
const webpack = require('webpack');
const express = require('express');
const wdm = require('webpack-dev-middleware');
const whm = require('webpack-hot-middleware');

require('source-map-support').install({
    // hookRequire for inline-sourcemaps support:
    hookRequire: true
});


const clientConfig = require('./webpack.client');
const serverConfig = require('./webpack.server');
const serverBin = path.resolve(serverConfig.output.path, 'app.server.js');


async function launch() {
    const app = express();

    const multiCompiler = [clientConfig, serverConfig];
    const wdmInstance = wdm(multiCompiler, {
        serverSideRender: true,
    });
    app.use(wdmInstance);
    app.use(whm(multiCompiler, {

    }));
    app.listen(3000);
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