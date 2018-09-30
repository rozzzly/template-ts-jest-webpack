import * as ink from 'ink';
import StatusBar from './StatusBar';
import Tracker from '../Tracker';

export interface AppProps {
    tracker: Tracker<string>;
    stdout: NodeJS.WriteStream;
}

export interface AppState {
    time: number;
}

export class App extends ink.Component<AppProps, AppState> {

    public state = {
        time: Date.now()
    };

    public render() {
        return (
            <span>
                <StatusBar tracker={this.props.tracker} />
            </span>
        );
    }

    public getChildContext() {
        return {
            console: {
                width: this.props.stdout.columns || 120,
                height: this.props.stdout.rows || 40
            }
        };
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
