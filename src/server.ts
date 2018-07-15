import { Application } from 'express';
import getRouter from './router';
export default function init(app: Application): void {
    let router = getRouter();

    if (module.hot) {
        module.hot.accept('./router', () => {
            console.log('change to ./router');
            router = getRouter();
        });
    }

    app.use((req, res, next) => router(req, res, next));
}
