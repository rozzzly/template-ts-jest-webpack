import * as React from 'react';
import Chalk from 'chalk';
import * as blessed from 'blessed';
import { Box } from './stub';
import { Grid } from 'react-blessed-contrib';


export const App: React.SFC = ({}) => (
    <Grid rows={12} cols={12}>
        <Box
            row={0}
            col={0}
            rowSpan={2}
            colSpan={12}
            border={false}
            content={`${Chalk.bgGreen.black('shared:')} ${Chalk.green('125ms')} / ${Chalk.bgHex('#cccccc').black('shared:')} ${Chalk.white('—')} / ${Chalk.bgRed.black('server:')} ${Chalk.red('5 errors, 2 warning')}`}
        />
        <Box
            row={2}
            col={0}
            rowSpan={10}
            colSpan={8}
            border={{type: 'line'}}
            style={{border: {fg: 'blue'}}}>
            Log Box
        </Box>
        <Box
            row={2}
            col={8}
            rowSpan={10}
            colSpan={4}
            border={{type: 'line'}}
            style={{border: {fg: 'blue'}}}>
            Build Stats
        </Box>
    </Grid>
);
export default App;
