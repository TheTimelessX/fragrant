import { EventEmitter } from "events";
import { ConstructorOptions, FragrantEvents, FragrantStorage, MessageTypes, FlagKind } from "./options.js";
export declare class Fragrant extends EventEmitter {
    private workingOn;
    private storage;
    private usage;
    private sensitivity;
    private emitUndefineds;
    constructor(opts?: ConstructorOptions);
    on<K extends keyof FragrantEvents>(event: K, listener: FragrantEvents[K]): this;
    emit<K extends keyof FragrantEvents>(event: K, ...args: Parameters<FragrantEvents[K]>): boolean;
    getCurrentWorking(): string[];
    add(type: MessageTypes, flags: {
        flag: string;
        kind?: FlagKind;
        help?: string;
    }[]): FragrantStorage[];
    remove(...flag_ids: string[]): boolean;
    clear(): void;
    getLiteralFlags(): FragrantStorage[];
    parse(): void;
}
