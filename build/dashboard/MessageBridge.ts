import { inspect } from 'util';

export interface LogMessage {
    channel: string;
    message: string;
    data?: any;
    dataStr?: string;
    timestamp: number;
}

export interface Logger {
    (message: string);
    (message: string, ...args: any[]);
}

export interface LogMap {
    [channel: string]: LogMessage[];
}

export interface Listener {
    (event: string, data: any): void;
}

export interface ListenerMap {
    [channel: string]: {
        [event: string]: Listener[];
    }
}

export default class MessageBridge {

    public listeners: ListenerMap;
    public logs: LogMap;
    public aggregateLog: LogMessage[];

    public constructor() {
        this.logs = {};
        this.listeners = {};
        this.aggregateLog = [];
    }

    public log(channel: string, message: string, ...args: any[]) {
        const log: LogMessage = {
            channel,
            message,
            timestamp: Date.now()
        } as any;
        if (args.length) {
            if (args.length === 1) {
                log.data = args[0];
            } else {
                log.data = args;
            }
            log.dataStr = inspect(log.data, true, 4, true);
        }
        this.aggregateLog.push(log);
        if (channel !== '*') {
            if (this.logs[channel]) {
                this.logs[channel].push(log);
            } else {
                this.logs[channel] = [log];
            }
        }
        this.getListeners(channel, 'log');
    }

    public emit(channel: string, event: string, data?: any): void {

    }


    public createLogger(channel: string): Logger {
        return (message, ...args) => this.log(channel, message, ...args);
    }

    private notify(channel: string, event: string, data: any) {
        const listeners = this.getListeners(channel, event);
        listeners.forEach(listener => listener(event, data))
    }

    private getListeners(channel: string, event: string): Listener[] {
        let ret: Listener[] = [];
        if (channel in this.listeners) {
            if (event in this.listeners[channel]) {
                ret = [...ret, ...this.listeners[channel]['event']];
            }
            if (event !== '*' && '*' in this.listeners[channel]) {
                ret = [...ret, ...this.listeners[channel]['*']];
            }
        }
        if (channel !== '*' && '*' in this.listeners) {
            if (event in this.listeners['*']) {
                ret = [...ret, ...this.listeners['*']['event']];
            }
            if (event !== '*' && '*' in this.listeners['*']) {
                ret = [...ret, ...this.listeners['*']['*']];
            }
        }
        return ret;
    }
}
