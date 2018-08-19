import * as React from 'react';
import { StaticRouter, StaticRouterProps } from 'react-router';
import { App, MOUNT_POINT_ID } from '../shared/App';
import Helmet from 'react-helmet';

/// NOTE:::not a SFC so it can be called as a function from a `.ts` file
export const renderApp = ({ ...props }):  React.ReactElement<StaticRouterProps> => (
    <StaticRouter {...props}>
        <App />
    </StaticRouter>
);

export interface HtmlProps {
    scripts?: string[];
    content: string;
}

export const renderHTML = ({ content, scripts = [] }: HtmlProps): React.ReactElement<any> => {
    const head = Helmet.renderStatic();
    return (
        <html {...(head.htmlAttributes.toComponent() as any) }>
        <head>
                {head.title.toComponent()}
                {head.meta.toComponent()}
                {head.link.toComponent()}
                {head.script.toComponent()}
                {head.style.toComponent()}
                {...scripts.map(script => (
                    <script src={script}></script>
                ))}
            </head>
            <body>
                <div id={MOUNT_POINT_ID} dangerouslySetInnerHTML={{ __html: content }}></div>
            </body>
        </html>
    );
};