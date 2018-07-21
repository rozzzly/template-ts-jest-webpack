import { Application } from 'express';
import getRouter from './modules/app/server';
export default function init(app: Application): void {
    let router = getRouter();

    if (module.hot) {
        module.hot.accept('./modules/app/server', () => {
            console.log('change to ./router');
            router = getRouter();
        });
    }

    app.use((req, res, next) => router(req, res, next));
}
