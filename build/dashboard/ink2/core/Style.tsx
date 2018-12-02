import * as React from 'react';
import { StyleComponentProps } from '../Text/Style/reactProps';


export interface GroupProps extends StyleComponentProps {
    children: React.ReactNode;
}

export const Style: React.SFC<GroupProps> = ({ children, ...style }) => (
    <style data-style={style}>
        { children }
    </style>
);
