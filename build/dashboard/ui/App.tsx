import *  as ink from 'ink';
import StatusBar from './StatusBar';
import Tracker from '../Tracker';

export interface AppProps {
    tracker: Tracker<string>;
    time: number;
}

export const App: ink.SFC<AppProps> = ({ tracker, time }) => (
    <div>
        <StatusBar tracker={tracker} time={time}/>
    </div>
);
export default App;


//
