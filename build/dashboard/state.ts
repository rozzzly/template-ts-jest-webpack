import LoggerState from './logger/state';
import TrackerState from './tracker/state';

export interface State {
    logger: LoggerState;
    tracker:  TrackerState;
}

export default State;
