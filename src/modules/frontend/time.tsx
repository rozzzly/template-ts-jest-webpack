import * as React from 'react';

export const time: React.SFC = ({}) => (
    <h2>the time is: { (new Date()).toLocaleDateString('en-us') }</h2>
);

export default time;