import {
    default as trackerActionCreators,
    Actions as TrackerActions,
    ActionIDs as TrackerActionIDs,
} from './tracker/actions';
import {
    default as loggerActionCreators,
    Actions as LoggerActions,
    ActionIDs as LoggerActionIDs,
} from './logger/actions';

export type Actions = (
    | LoggerActions
    | TrackerActions
);

export type ActionIDs = (
    | LoggerActionIDs
    | TrackerActionIDs
);

export default {
    tracker: trackerActionCreators,
    logger: loggerActionCreators
};
