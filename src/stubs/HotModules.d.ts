declare interface NodeModule {
    hot?: {
        accept(path: string): void;
        accept(handler: () => void): void;
        accept(path: string, handler: () => void): void;
    }
}
