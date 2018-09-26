import * as ink  from 'ink';
import StatusBar from './StatusBar';
import Tracker from '../Tracker';

export interface AppProps {
    tracker: Tracker<string>;
    time: number;
}
{/* <StatusBar tracker={tracker} time={time}/> */}

export const App: ink.SFC<AppProps> = ({ tracker, time }) => (
    <div>
        lol
    </div>
);
export default App;


//
