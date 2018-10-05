import * as ink from 'ink';
import * as ansiEscapes from 'ansi-escapes';

import { connect } from 'react-redux';
import StatusBar from './StatusBar';
import CompilerTracker from '../CompilerTracker';
import ErrorDisplay from './ErrorDisplay';
import State from '../state';
import { CompilerState } from '../tracker/CompilerPhase';

export interface AppProps {
    tracker: CompilerTracker<string>;
    stdout: NodeJS.WriteStream;
}

export interface AppState {
    time: number;
    compilers: {
        [id: string]: CompilerState;
    };
}


@connect((state: State) => ({
    compilers: state.tracker.compilers
}))
export class App extends ink.Component<AppProps, AppState> {

    public constructor(props: AppProps) {
        super(props);
        this.cleanRender = this.cleanRender.bind(this);
    }

    public render() {
        return (
            <span>
                <StatusBar tracker={this.props.tracker} />
                <ErrorDisplay tracker={this.props.tracker } />
            </span>
        );
    }

    public getChildContext() {
        const stdout = this.props.stdout;
        return {
            console: {
                get width(): number {
                    return !!stdout.columns ? stdout.columns : 120;
                },
                get height(): number {
                    return !!stdout.rows ? stdout.rows :  40;
                }
            }
        };
    }

    public componentDidMount() {
        this.props.stdout.on('resize', this.cleanRender);
        this.props.tracker.runnerCb = () => this.forceUpdate();
    }

    public componentWillUnmount() {
        this.props.stdout.off('resize', this.cleanRender);
        this.props.tracker.runnerCb = null;
    }
    private cleanRender() {
        this.props.stdout.write(ansiEscapes.clearScreen);
        this.forceUpdate();
    }
}



// export const App: ink.SFC<AppProps> = ({ tracker, time }) => (
//     <div>
//         <br />
//         <StatusBar tracker={tracker} time={time}/>
//     </div>
// );
export default App;


//
