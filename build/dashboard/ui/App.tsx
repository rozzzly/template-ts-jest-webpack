import * as ink from 'ink';
import * as ansiEscapes from 'ansi-escapes';
import StatusBar from './StatusBar';
import Tracker from '../Tracker';
import ErrorDisplay from './ErrorDisplay';

export interface AppProps {
    tracker: Tracker<string>;
    stdout: NodeJS.WriteStream;
}

export interface AppState {
    time: number;
}

export class App extends ink.Component<AppProps, AppState> {

    public constructor(props: AppProps) {
        super(props);
        this.onResize = this.onResize.bind(this);
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
                    return stdout.columns || 120;
                },
                get height(): number {
                    return stdout.rows || 40;
                }
            }
        };
    }

    public componentDidMount() {
        this.props.stdout.on('resize', this.onResize);
        this.props.tracker.runnerCb = () => this.forceUpdate();
    }

    public componentWillUnmount() {
        this.props.stdout.off('resize', this.onResize);
        this.props.tracker.runnerCb = null;
    }
    private onResize() {
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
