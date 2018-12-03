import * as React from 'react';
import { InlineStyleComponentProps } from '../Text/Style/reactProps';


export interface GroupProps extends InlineStyleComponentProps {
    children: React.ReactNode;
}

export const Style: React.SFC<GroupProps> = ({ children, ...style }) => (
    <style data-style={style}>
        { children }
    </style>
);
