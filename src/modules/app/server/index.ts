import * as express from 'express';
import { renderToString, renderToStaticMarkup } from 'react-dom/server';
import { matchPath, StaticRouterContext } from 'react-router';
import routes from '../shared/routes';
import { renderApp, renderHTML } from './render';

export async function handleRequest(req: express.Request, res: express.Response): Promise<void> {
    console.log(`got request for: ${req.url}`);
    const match = routes.find(({ path, exact }) => !!matchPath(req.url, { path, exact, strict: false })); /// TODO ::: load strict per route
    if (req.url === '/404') res.status(404);
    if (!match) {
        /// TODO ::: implement (better) 404
        res.redirect('/404');
    } else {
        const context: StaticRouterContext = {};
        const app = renderApp({ location: req.url, context });

        if (context.url) {
            res.writeHead(302, {
              Location: context.url
            });
            res.end();
        } else {
            if (req.url !== '/404') res.status(200);

            const content = renderToString(app);

            const stats: any = res.locals.webpackStats ? res.locals.webpackStats.toJson() : [];
            const appOutput: string[] = (stats.assetsByChunkName.app
                ? (Array.isArray(stats.assetsByChunkName.app)
                    ? stats.assetsByChunkName.app
                    : [stats.assetsByChunkName.app]
                ) : []
            );
            const scripts = appOutput.filter(path => path.endsWith('.js'));

            const html = renderToStaticMarkup(renderHTML({ content, scripts }));

            res.send('<!doctype html>\n' + html); /// TODO ::: render HTML wrapper
            /// TODO ::: investigate streaming
            res.end();
        }

    }
}

export function getRouter(): express.Router {
    const router = express.Router();
    router.use(handleRequest);
    return router;
}
