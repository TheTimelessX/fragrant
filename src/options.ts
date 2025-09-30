export type messageTypes = "call" | "middle" | "store";

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
    err:  (fragrantErrMessage: FragrantErr) => void;
}

export interface FragrantStroage {
    type: messageTypes;
    flag: string;
    id: string;
}

export interface ConstructorOptions {
    workingOn?: string[];
    sensitivity?: "high" | "low"; // high: will return usage banner if no argument inputted
    usage?: string;
}

export class InvalidFlagType extends Error {};
export class EmptyFlag extends Error {};