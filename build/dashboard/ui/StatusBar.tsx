import * as React from 'react';
import * as cliSpinners from 'cli-spinners';
import Chalk from 'chalk';
import Tracker from '../Tracker';
import CompilerHandle from '../CompilerHandle';
import { clearInterval } from 'timers';

console.log(cliSpinners);

export interface StatusBarProps {
    speed: number;
    paused: boolean;
    tracker: Tracker<string>;
}

export default class StatusBar extends React.Component<StatusBarProps> {

    public static defaultProps = {
        speed: 128,
        paused: false
    };

    private static SPINNER_START: number = Date.now();
    private static SPINNER_CYCLE: number = cliSpinners.clock.frames.length  * cliSpinners.clock.interval;

    private ticker: any;

    public render() {
        return (
            this.props.tracker.map(h => (
                this.renderStatusBarItem(h)
            )).join('  —  ')
        );
    }

    public componentWillReceiveProps(nextProps: StatusBarProps) {
        if (this.ticker && nextProps.paused) { // running and about to pause
            clearInterval(this.ticker);
        } else if (!this.ticker && !nextProps.paused) {  // not running and about to unpause
            this.ticker = setInterval(() => this.forceUpdate(), nextProps.speed);
        } else if (!nextProps.paused && this.props.speed !== nextProps.speed) { // (already running) but needs to update speed
            clearInterval(this.ticker);
            this.ticker = setInterval(() => this.forceUpdate(), nextProps.speed);
        }
    }

    public componentDidMount() {
        if (!this.props.paused) {
            this.ticker = setInterval(() => this.forceUpdate(), this.props.speed);
        }
    }
    public componentWillUnmount() {
        if (this.ticker) {
            clearInterval(this.ticker);
        }
    }

    private renderStatusBarItem(handle: CompilerHandle<string>): string {
        let result: string = ` [ ${handle.id} ] `;

        if (handle.phase === 'idle') {
            if (handle.status === 'clean') {
                result = Chalk.bgGreen.hex('#010101').bold(result);
            } else if (handle.status === 'failed') {
                result = Chalk.bgYellow.hex('#010101').bold(result);
            } else if (handle.status === 'dirty') {
                result = Chalk.bgGreen.hex('#010101').bold(result);
            } else { /// should never be the called
                result = Chalk.bgMagenta.hex('#010101').bold(result);
            }
        } else if (handle.phase === 'running') {
            result = (
                `${
                    Chalk.bgCyan.hex('#010101').bold(result)
                } ${Chalk.cyan(
                    `${
                        StatusBar.renderSpinner()
                    } ${handle.runtime}ms`
                )}`
            );
        } else {
            result = Chalk.bgHex('#999999').white.bold(result);
        }

        return result;
    }

    private static renderSpinner(): string {
        const delta = Date.now() - StatusBar.SPINNER_START;
        const cycleDelta = delta % StatusBar.SPINNER_CYCLE;
        const frameIndex = Math.floor((cycleDelta / this.SPINNER_CYCLE) * cliSpinners.clock.frames.length);
        return cliSpinners.clock.frames[frameIndex];
    }
}
