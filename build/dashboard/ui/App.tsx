import * as ansiEscapes from 'ansi-escapes';
import * as React from 'react';
import { Box } from 'ink';
import { connect } from 'react-redux';

import StatusBar from './StatusBar';
import State from '../State';


export interface AppProps {
    stdout: NodeJS.WriteStream;
    activeCompilers: number;
}

class _App extends React.Component<AppProps> {

    private timer?: NodeJS.Timer;

    public componentDidCatch(error: Error, info: React.ErrorInfo) {
        process.stderr.write(String(error));
        process.stderr.write(String(info));
        process.exit(-1);
    }

    public render(): React.ReactNode {
        return (
            <Box alignItems='flex-start' flexDirection='column'>
                <StatusBar />
                <Box flexGrow={1}>
                    { this.props.activeCompilers + ' ' + String(Date.now()) }
                </Box>
            </Box>
        );
    }

    // public getChildContext() {
    //     const stdout = this.props.stdout;
    //     return {
    //         console: {
    //             get width(): number {
    //                 return !!stdout.columns ? stdout.columns : 120;
    //             },
    //             get height(): number {
    //                 return !!stdout.rows ? stdout.rows :  40;
    //             }
    //         }
    //     };
    // }

    public componentDidMount() {
        // this.props.stdout.on('resize', this.cleanRender.bind(this));
        if (this.props.activeCompilers) {
            this.timer = setInterval(() => this.forceUpdate(), 333);
        }
    }

    public componentDidUpdate(prevProps: AppProps) {
        if (prevProps.activeCompilers && !this.props.activeCompilers && this.timer) {
             clearInterval(this.timer);
        } else if (!prevProps.activeCompilers && this.props.activeCompilers && !this.timer) {
            this.timer = setInterval(() => this.forceUpdate(), 333);
        }
    }

    public componentWillUnmount() {
        if (this.timer) clearInterval(this.timer);
        // this.props.stdout.off('resize', this.cleanRender);
    }
    private cleanRender() {
        // this.props.stdout.write(ansiEscapes.clearScreen);
        // this.forceUpdate();
    }
}

export const App = connect((state: State) => ({
    activeCompilers: state.tracker.activeCompilers
}))(_App);

export default App;
