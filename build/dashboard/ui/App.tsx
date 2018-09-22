import * as React from 'react';
import { Box } from './stub';



export const App: React.SFC = ({}) => (
    <Box
        top='center'
        left='center'
        width='50%'
        height='50%'
        border={{type: 'line'}}
        style={{border: {fg: 'blue'}}}>
        Hello World!
    </Box>
);
export default App;
