import * as React from 'react-dom';
import * as ink from 'ink';
import { MOUNT_POINT_ID } from '../shared/App';
import { render } from './render';

let mountPoint: HTMLDivElement | null;

window.addEventListener('load', () => {
    mountPoint = document.querySelector(`#${MOUNT_POINT_ID}`);

    if (!mountPoint) {
        mountPoint = new HTMLDivElement();
        mountPoint.id = MOUNT_POINT_ID;
        document.body.appendChild(mountPoint);
    } else {
        throw new Error('mount point not found');
    }

    React.render(render(), mountPoint);
});
