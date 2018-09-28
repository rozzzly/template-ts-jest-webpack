import * as ink from 'ink';
import * as Spinner from 'ink-spinner';
import Chalk from 'chalk';
import { lib as emoji } from 'emojilib';
import Tracker from '../Tracker';
import CompilerHandle from '../CompilerHandle';
import { Spacer, Line } from './Spacer';


export interface StatusBarItemProps {

}

export const StatusBarItem: ink.SFC<StatusBarItemProps> = () => {

};
export interface StatusBarProps {
    tracker: Tracker<string>;
}


export default class StatusBar extends ink.Component<StatusBarProps> {

    public render() {
        return (
            <div>
                {
                    this.props.tracker.map(h => (
                        this.renderStatusBarItem(h)
                    ))
                }
                <br />
                <Line />
            </div>
        );
    }

    private renderStatusBarItem(handle: CompilerHandle<string>)  {
        let label: string = ` [ ${handle.id} ] `;
        const record = handle.state!;
        if (handle.phase === 'idle') {
            if (handle.status === 'clean') {
                return (
                    <span>
                        <Spacer count={2} character={' '} />
                        <ink.Color bgGreen hex='#010101' bold>{ label }</ink.Color>
                        <Spacer count={2} character={' '} />
                        <ink.Color green>built</ink.Color>
                        <Spacer count={1} character={' '} />
                        ({record.duration}ms)
                    </span>
                );
            } else if (handle.status === 'failed') {
                return (
                    <span>
                        <Spacer count={2} character={' '} />
                        <ink.Color bgRed hex='#010101' bold>{ label }</ink.Color>
                        <Spacer count={2} character={' '} />
                        <ink.Color red>fatal crash</ink.Color>
                        <Spacer count={1} character={' '} />
                        ({record.duration}ms)
                    </span>
                );
            } else if (handle.status === 'dirty') {
               return 'dirty';
            } else { /// should never be the called
                return (
                    <span>
                        <Spacer count={2} character={' '} />
                        <ink.Color bgMagenta hex='#010101' bold>{ label }</ink.Color>
                        <Spacer count={2} character={' '} />
                        <ink.Color magenta>building</ink.Color>

                    </span>
                );
            }
        } else if (handle.phase === 'running') {
            // return [label, symbol, message, timestamp].join(Chalk.reset(' '));
            return (
                <span>
                    <Spacer count={2} character={' '} />
                    <ink.Color bgCyan hex='#010101' bold>{ label }</ink.Color>
                    <Spacer count={2} character={' '} />
                    <Spinner cyan />
                    <Spacer count={2} character={' '} />
                    <ink.Color cyan>building</ink.Color>
                    ({handle.runtime}ms)
                </span>
            );
        } else {
            return (
                <span>
                    <Spacer count={2} character={' '} />
                    <ink.Color bgHex='#999999' hex='#fefefe' bold>{ label }</ink.Color>
                    <Spacer count={2} character={' '} />
                    uninitiated
                </span>
            );

        }
    }
}
