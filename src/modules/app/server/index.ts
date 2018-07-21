import * as express from 'express';
import { renderToString } from 'react-dom/server';
import { matchPath, StaticRouterContext } from 'react-router';
import routes from '../shared/routes';
import render from './render';

export async function handleRequest(req: express.Request, res: express.Response): Promise<void> {
    console.log(`got request for: ${req.url}`);
    const match = routes.find(({ path, exact }) => !!matchPath(req.url, { path, exact, strict: false })); /// TODO ::: load strict per route
    if (req.url === '/404') res.status(404);
    if (!match) {
        /// TODO implement (better) 404
        res.redirect('/404');
    } else {
        const context: StaticRouterContext = {};
        const content = renderToString(render({ location: req.url, context }));

        if (context.url) {
            res.writeHead(302, {
              Location: context.url
            });
            res.end();
        } else {
            if (req.url !== '/404') res.status(200);
            res.send('<!doctype html>\n' + content); /// TODO ::: render HTML wrapper
            /// TODO ::: investigate streaming
            res.end();
        }

    }
}
export default function getRouter(): express.Router {
    const router = express.Router();
    router.use(handleRequest);

    return router;
}