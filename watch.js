const path = require('path');
const webpack = require('webpack');
const express = require('express');

require('source-map-support').install({
    // hookRequire for inline-sourcemaps support:
    hookRequire: true
});


const config = require('./webpack.server');
const serverBin = path.resolve(config.output.path, 'server.js');




async function launch() {
    const app = express();

    let failed = false;
    try {
        await new Promise(resolve => {
            const compiler = webpack(config);
            compiler.watch({ /*filename: serverBin */}, function(err, stats) {
                if (err) {
                    console.error(err);
                    reject(err);
                } else {
                    ///console.info(stats);
                    resolve(stats);
                }
            });
        });
    } catch (e) {
        failed = true;
        console.error('compilation failed', e);
    }
    
    if (!failed) {
        try {
            require(serverBin)(app);
            app.listen(3000);
        } catch(e) {
            console.error('compilation failed', e);
        }
    } else {
        process.exit(-1);
    }
};

launch();