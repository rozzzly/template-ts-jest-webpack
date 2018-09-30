import * as ink from 'ink';
import * as Spinner from 'ink-spinner';
import Chalk from 'chalk';
import { lib as emoji } from 'emojilib';
import Tracker from '../Tracker';
import CompilerHandle, { CompilerState } from '../CompilerHandle';
import { Spacer, Line } from './Spacer';


export interface StatusBarItemProps {
    id: string;
    index: number;
    state: CompilerState;
}

export const StatusBarItem: ink.SFC<StatusBarItemProps> = ({ id, index, state }) => {
    const label =  ` [ ${id} ] `;
    if (state.status === null) {
        return (
            <span>
                <Spacer count={ index ?  2 : 1 } character={' '} />
                <ink.Color bgHex='#999999' hex='#fefefe' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    inactive
                </ink.Color>
            </span>
        );
    } else if (state.status === 'clean') {
        return (
            <span>
                <Spacer count={ index ?  2 : 1 } character={' '} />
                <ink.Color bgGreen hex='#010101' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color green>clean</ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    { `(${state.duration}ms)` }
                </ink.Color>
            </span>
        );
    } else if (state.status === 'dirty') {
        return (
            <span>
                <Spacer count={ index ?  2 : 1 } character={' '} />
                <ink.Color bgRed hex='#010101' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color red>
                    { state.errors.length } errors / { state.warnings.length } warnings
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    { `(${state.duration}ms)` }
                </ink.Color>
            </span>
        );
    } else if (state.status === 'invalid') {
        return (
            <span>
                <Spacer count={ index ?  2 : 1 } character={' '} />
                <ink.Color bgBlue hex='#010101' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <Spinner blue />
                <Spacer count={1} character={' '} />
                <ink.Color blue>
                    building
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    { `(${state.duration}ms)` }
                </ink.Color>
            </span>
        );
    } else if (state.status === 'failed') {
        return (
            <span>
                <Spacer count={ index ?  2 : 1 } character={' '} />
                <ink.Color bgYellow hex='#010101' bold>
                    { label }
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color yellow>
                    fatal error
                </ink.Color>
                <Spacer count={1} character={' '} />
                <ink.Color hex='#999999'>
                    { `(${state.duration}ms)` }
                </ink.Color>
            </span>
        );
    } else {
        return (
            <span>
                wtf
            </span>
        );
    }
};
export interface StatusBarProps {
    tracker: Tracker<string>;
}

export default class StatusBar extends ink.Component<StatusBarProps> {

    public render() {
        let index = 0;
        return (
            <div>
                {
                    this.props.tracker.map((handle, id) => (
                        <StatusBarItem state={handle.state} index={index++} id={id} />
                    ))
                }
            </div>
        );
    }

    public componentDidMount() {
        this.props.tracker.runnerCb = () => this.forceUpdate();
    }

    public componentWillUnmount() {
        this.props.tracker.runnerCb = null;
    }
}
