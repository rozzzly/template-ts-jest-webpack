import * as ink from 'ink';
import Chalk from 'chalk';
import { lib as emoji } from 'emojilib';
import Tracker from '../Tracker';
import CompilerHandle from '../CompilerHandle';


export interface StatusBarProps {
    speed: number;
    time: number;
    paused: boolean;
    tracker: Tracker<string>;
}

export default class StatusBar extends ink.Component<StatusBarProps> {

    public static defaultProps = {
        speed: 100,
        paused: false
    };

    private static SPINNER_START: number = Date.now();
    private static SPINNER_CYCLE: number = cliSpinners.clock.frames.length  * cliSpinners.clock.interval;

    private ticker: any;

    public render() {
        return (
            <div>
                {
                    this.props.tracker.map(h => (
                        this.renderStatusBarItem(h)
                    )).join('  —  ')
                }
            </div>
        );
    }

    /// TODO ::: componentWillUnmount is deprecated --> remove internal time management -->
    ///         move `Tracker` higher in Component tree, send subset of `CompilerHandle` data to `StatusBar` (make it an sfc)
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
            //this.ticker = setInterval(() => this.forceUpdate(), this.props.speed);
        }
    }
    public componentWillUnmount() {
        if (this.ticker) {
            clearInterval(this.ticker);
        }
    }

    private renderStatusBarItem(handle: CompilerHandle<string>): string {
        let label: string = ` [ ${handle.id} ] `;
        let result: string = ` [ ${handle.id} ] `;
        let symbol: string = '';
        let message: string = '';
        let timestamp: string = '';

        const spinner = StatusBar.renderSpinner();
        const record = handle.currentRecord!;
        if (handle.phase === 'idle') {
            if (handle.status === 'clean') {
                label = Chalk.bgGreen.hex('#010101').bold(result);
                symbol = emoji.heavy_check_mark.char;
                message = Chalk.green('built');
                timestamp = Chalk.dim(`in ${record.duration}ms`);
                return [label, symbol, message, timestamp].join(Chalk.reset(' '));
            } else if (handle.status === 'failed') {
                label = Chalk.bgRed.hex('#010101').bold(result);
                symbol = ((Math.floor(Date.now() / 1000) % 2 === 0)
                    ? emoji.rotating_light.skull
                    : emoji.rotating_light.char
                );
                message = Chalk.bgRed('fatal crash');
                timestamp = Chalk.dim(`after ${record.duration}`);
                return [label, symbol, message, timestamp].join(Chalk.reset(' '));
            } else if (handle.status === 'dirty') {
                if (record.errors && record.errors.length) {
                    label = Chalk.bgRed.hex('#010101').bold(result);
                    symbol = emoji.x.char;
                    message = Chalk.yellow(`built with ${record.errors!.length} errors and ${record.warnings!.length} warnings`);
                    timestamp = Chalk.dim(`in ${record.duration}ms`);
                } else {
                    label = Chalk.bgYellow.hex('#010101').bold(result);
                    symbol = emoji.alert.char;
                    message = Chalk.yellow(`built with ${record.errors!.length} errors and ${record.warnings!.length} warnings`);
                    timestamp = Chalk.dim(`in ${record.duration}ms`);
                }
                return [label, symbol, message, timestamp].join(Chalk.reset(' '));
            } else { /// should never be the called
                label = Chalk.bgMagenta.hex('#010101').bold(result);
                return [label, 'huh wtf'].join(Chalk.reset(' '));
            }
        } else if (handle.phase === 'running') {
            label = Chalk.bgCyan.hex('#010101').bold(label);
            symbol = spinner;
            message = Chalk.cyan('building');
            timestamp = `${handle.runtime}ms`;
            return [label, symbol, message, timestamp].join(Chalk.reset(' '));
        } else {
            label = Chalk.bgHex('#999999').hex('#fefefe').bold(result);
            message = 'uninitiated';
            return [label, message].join(Chalk.reset(' '));

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
