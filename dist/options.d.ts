export type messageTypes = "call" | "middle" | "store";
export type argumentKind = "literal" | "optional";
export interface FragrantArguments {
    type: messageTypes;
    value: string | boolean | undefined;
    id: string;
}
export interface FragrantErr {
    message: string;
}
export interface FragrantEvents {
    find: (fragrantArgumentsCallback: FragrantArguments) => void;
    err: (fragrantErrMessage: FragrantErr) => void;
}
export interface FragrantStroage {
    type: messageTypes;
    flag: string;
    id: string;
    kind: argumentKind;
}
export interface ConstructorOptions {
    workingOn?: string[];
    sensitivity?: "high" | "low";
    usage?: string;
}
export declare class InvalidFlagType extends Error {
}
export declare class EmptyFlag extends Error {
}
