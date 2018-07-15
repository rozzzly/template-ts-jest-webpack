import { Router } from 'express';
import { message } from './message';
export default function getRouter(): Router {
    const router = Router();

    router.get('/time', (req, res) => res.end(`The time is: ${Date.now()}`));
    router.get('/message', (req, res) => res.end(message));

    return router;
}