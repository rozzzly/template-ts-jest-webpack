import * as React from 'react';
import { YogaProps } from '../Tree/yoga/props';


export interface GroupProps extends Partial<YogaProps> {
    children: React.ReactNode;
}

export const Group: React.SFC<GroupProps> = ({ children, ...yoga }) => (
    <div data-yoga={yoga}>
        { children }
    </div>
);
