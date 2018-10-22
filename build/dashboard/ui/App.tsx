import * as ansiEscapes from 'ansi-escapes';
import * as React from 'react';
import { Box } from 'ink';
import { connect } from 'react-redux';

import StatusBar from './StatusBar';
import State from '../State';
import ScrollView from './ScrollView/ScrollView';


export interface AppProps {
    stdout: NodeJS.WriteStream;
    activeCompilers: number;
}

export interface AppState {
    rows: number;
    cols: number;
}

class App extends React.Component<AppProps, AppState> {

    private timer?: NodeJS.Timer;

    public constructor(props: AppProps) {
        super(props);
        // "Only use this pattern if you intentionally want to ignore prop updates."
        //      @see https://reactjs.org/docs/react-component.html#constructor
        this.state = { rows: props.stdout.rows || 0, cols: props.stdout.columns || 0 };
    }

    public componentDidCatch(error: Error, info: React.ErrorInfo) {
        process.stderr.write(ansiEscapes.clearScreen);
        process.stderr.write(String(error));
        process.stderr.write(String(info));
        process.exit(-1);
    }

    public render(): React.ReactNode {
        return (
            <Box alignItems='flex-start' flexDirection='column'>
                <StatusBar bordered={true} width={this.state.cols} />
                <ScrollView rows={this.state.rows} cols={this.state.cols} />
            </Box>
        );
    }

    public componentDidMount() {
        this.props.stdout.on('resize', this.onResize.bind(this));
        if (this.props.activeCompilers) {
            this.timer = setInterval(() => this.forceUpdate(), 333);
        }
    }

    public componentDidUpdate(prevProps: AppProps) {
        if (prevProps.activeCompilers && !this.props.activeCompilers && this.timer) {
             clearInterval(this.timer);
        } else if (!prevProps.activeCompilers && this.props.activeCompilers && !this.timer) {
            this.timer = setInterval(() => this.forceUpdate(), 150);
        }
    }

    public componentWillUnmount() {
        if (this.timer) clearInterval(this.timer);
        // this.props.stdout.off('resize', this.cleanRender);
    }
    private onResize() {
        this.props.stdout.write(ansiEscapes.clearScreen);
        this.setState({
             rows: this.props.stdout.rows || 0,
             cols: this.props.stdout.columns || 0
        });
    }
}

const ConnectedApp = connect((state: State) => ({
    activeCompilers: state.tracker.activeCompilers
}))(App);

export {
    ConnectedApp as App,
    ConnectedApp as default
};
