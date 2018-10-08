import * as React from 'react';
import * as ink from 'ink';
// import * as ansiEscapes from 'ansi-escapes';

import { connect } from 'react-redux';
// import StatusBar from './StatusBar';
// import CompilerTracker from '../CompilerTracker';
// import ErrorDisplay from './ErrorDisplay';
import State from '../state';
import { CompilerState } from '../tracker/CompilerPhase';

export interface AppProps {
    stdout: NodeJS.WriteStream;
    compilers: {
        [id: string]: CompilerState;
    };
}

class App extends React.Component<AppProps> {


    public render(): React.ReactNode {
        return (
            <ink.Box>
                { Date.now() }
                { Object.keys(this.props.compilers).join(',') }
            </ink.Box>
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

    // public componentDidMount() {
    //     this.props.stdout.on('resize', this.cleanRender);
    //     this.props.tracker.runnerCb = () => this.forceUpdate();
    // }

    // public componentWillUnmount() {
    //     this.props.stdout.off('resize', this.cleanRender);
    //     this.props.tracker.runnerCb = null;
    // }
    // private cleanRender() {
    //     this.props.stdout.write(ansiEscapes.clearScreen);
    //     this.forceUpdate();
    // }
}

const ConnectedApp = connect((state: State) => ({
    compilers: state.tracker.compilers
}))(App);

export {
    ConnectedApp as App,
    ConnectedApp as default
};

// export const App: ink.SFC<AppProps> = ({ tracker, time }) => (
//     <div>
//         <br />
//         <StatusBar tracker={tracker} time={time}/>
//     </div>
// );



//
