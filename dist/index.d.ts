import { EventEmitter } from "events";
import { ConstructorOptions, FragrantEvents, FragrantStroage, messageTypes } from "./options.js";
export declare class Fragrant extends EventEmitter {
    private workingOn;
    private stroage;
    private usage;
    private sensitivity;
    constructor(opts?: ConstructorOptions);
    on<K extends keyof FragrantEvents>(event: K, listener: FragrantEvents[K]): this;
    emit<K extends keyof FragrantEvents>(event: K, ...args: Parameters<FragrantEvents[K]>): boolean;
    getCurrentWorking(): string[];
    add(type: messageTypes, flags: {
        flag: string;
        kind?: "literal" | "optional";
    }[]): FragrantStroage[];
    remove(...flag_ids: string[]): boolean;
    clear(): boolean;
    catchStorage(): FragrantStroage[];
    getFlag(flag: string): FragrantStroage | undefined;
    parse(): void;
}
