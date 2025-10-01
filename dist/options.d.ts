export type MessageTypes = "call" | "middle" | "store";
export type FlagKind = "literal" | "optional";
export interface FragrantArguments {
    type: MessageTypes;
    value: string | boolean | undefined;
    id: string;
    flag: string;
}
export interface FragrantErr {
    message: string;
}
export interface FragrantEvents {
    find: (fragrantArgumentsCallback: FragrantArguments) => void;
    err: (fragrantErrMessage: FragrantErr) => void;
}
export interface FragrantStorage {
    type: MessageTypes;
    flag: string;
    kind: FlagKind;
    id: string;
    help?: string;
}
export interface ConstructorOptions {
    workingOn?: string[];
    sensitivity?: "high" | "low";
    usage?: string;
    emitUndefinedValues?: boolean;
}
export declare class InvalidFlagType extends Error {
}
export declare class EmptyFlag extends Error {
}
