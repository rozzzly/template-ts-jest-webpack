import * as React from 'react';
import { YogaProps } from '../Tree/yoga/props';
import { StyleGroupProps } from '../Text/Style/reactProps';


export interface GroupProps extends Partial<YogaProps> {
    children: React.ReactNode;
    style?: StyleGroupProps;
}

export const Group: React.SFC<GroupProps> = ({ children, style, ...yoga }) => (
    <div data-yoga={yoga} data-style={style}>
        { children }
    </div>
);
