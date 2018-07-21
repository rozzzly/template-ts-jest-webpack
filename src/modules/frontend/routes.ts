import Home from './home';
import Error404 from './error404';
import Time from './time';

export default [
    {
        path: '/',
        exact: true,
        component: Home
    },
    {
        path: '/time',
        exact: true,
        component: Time
    },
    {
        path: '/404',
        component: Error404
    }
];