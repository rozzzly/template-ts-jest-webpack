export interface IncomingLogMessage {
    channel: string | null;
    message: string;
    data?: any;
}

export interface LogMessage {
    id: string;
    dataStr?: string;
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
