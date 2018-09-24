import * as React from 'react';
import Chalk from 'chalk';
import * as blessed from 'blessed';
import { Box, Element } from './stub';
import { Grid } from 'react-blessed-contrib';
import StatusBar from './StatusBar';
import Tracker from '../Tracker';

export interface AppProps {
    tracker: Tracker<string>;
}

export const App: React.SFC<AppProps> = ({ tracker }) => (
    <>
        <Box
            top={0}
            left={0}
            width={'100%'}
        >
            <StatusBar tracker={tracker} />
        </Box>
        <Box
            top={1}
            left={0}
            width={'75%'}
            label={'Webpack Log'}
            border={{type: 'line'}}
            style={{border: {fg: 'blue'}}}>
            Log Box
        </Box>
        <Box
            top={1}
            left={'25%'}
            width={'100%'}
            border={{type: 'line'}}
            style={{border: {fg: 'blue'}}}>
            Build Stats
        </Box>

    </>
);
export default App;


//
