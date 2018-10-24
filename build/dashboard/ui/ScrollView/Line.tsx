import { Box } from 'ink';
import * as React from 'react';


export type LineRef = React.RefObject<{
    yogaNode: any
}>;

export interface LineProps {
    filler: string | false;
    content: string;
}

export class Line extends React.Component<LineProps> {

    private nodeRef: LineRef;
    public constructor(props: LineProps) {
        super(props);
        this.nodeRef = React.createRef();
    }

    public unstable__getComputedWidth() {
		return (this.nodeRef.current ? this.nodeRef.current.yogaNode.getComputedWidth() : 0);
	}

    public render() {
        return (
            <div ref={this.nodeRef as any}>
            </div>
        )
    };

}
