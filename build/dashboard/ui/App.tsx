import * as ansiEscapes from 'ansi-escapes';
import * as React from 'react';
import { Box } from 'ink';

import StatusBar from './StatusBar';


export interface AppProps {
    stdout: NodeJS.WriteStream;
}

export class App extends React.Component<AppProps> {

    private timer?: NodeJS.Timer;

    public render(): React.ReactNode {
        return (
            <Box alignItems='flex-start' flexDirection='column'>
                <StatusBar />
                <Box flexGrow={1}>
                    { String(Date.now()) }
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
        // this.props.stdout.on('resize', this.cleanRender);
        // this.timer = setInterval(this.cleanRender.bind(this), 333);
    }

    public componentWillUnmount() {
        // this.props.stdout.off('resize', this.cleanRender);
        // if (this.timer) clearInterval(this.timer);
    }
    private cleanRender() {
        // this.props.stdout.write(ansiEscapes.clearScreen);
        // this.forceUpdate();
    }
}

export default App;
