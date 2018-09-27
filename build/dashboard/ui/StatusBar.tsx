import * as ink from 'ink';
import * as Spinner from 'ink-spinner';
import Chalk from 'chalk';
import { lib as emoji } from 'emojilib';
import Tracker from '../Tracker';
import CompilerHandle from '../CompilerHandle';
import { Spacer } from './Spacer';


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
            </div>
        );
    }

    private renderStatusBarItem(handle: CompilerHandle<string>)  {
        let label: string = ` [ ${handle.id} ] `;
        const record = handle.currentRecord!;
        if (handle.phase === 'idle') {
            if (handle.status === 'clean') {
                return (
                    <span>
                        <Spacer count={2} character={' '} />
                        <ink.Color bgGreen hex='#010101' bold>{ label }</ink.Color>
                        <Spacer count={2} character={' '} />
                        <ink.Color green>built</ink.Color>
                        {record.duration}ms
                    </span>
                );
            } else if (handle.status === 'failed') {
                return (
                    <span>
                        <ink.Color bgRed hex='#010101' bold>{ label }</ink.Color>
                        <ink.Color red>fatal crash</ink.Color>
                        {record.duration}ms
                    </span>
                );
            } else if (handle.status === 'dirty') {
               return 'dirty';
            } else { /// should never be the called
                return (
                    <span>
                        <ink.Color bgMagenta hex='#010101' bold>{ label }</ink.Color>
                        <ink.Color magenta>building</ink.Color>
                    </span>
                );
            }
        } else if (handle.phase === 'running') {
            // return [label, symbol, message, timestamp].join(Chalk.reset(' '));
            return (
                <span>
                    <ink.Color bgCyan hex='#010101' bold>{ label }</ink.Color>
                    <Spinner cyan />
                    <ink.Color cyan>building</ink.Color>
                    {handle.runtime}ms
                </span>
            );
        } else {
            return (
                <span>
                    <ink.Color bgHex='#999999' hex='#fefefe' bold>{ label }</ink.Color>
                    uninitiated
                </span>
            );

        }
    }
}
