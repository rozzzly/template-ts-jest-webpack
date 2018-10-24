export interface IncomingLogMessage {
    channel: string | null;
    kind: string;
    [extra: string]: any;
}

export interface LogMessage extends IncomingLogMessage {
    id: string;
    timestamp: number;
}


export const initialState: State = {
    entities: { },
    index: {
        byTimestamp: [],
        byChannel: {},
    }
};

export interface State {
    entities: {
        [logID: string]: LogMessage;
    };
    index: {
        byTimestamp: string[];
        byChannel: {
            [channelID: string]: string[];
        }
    };
}

export default State;
