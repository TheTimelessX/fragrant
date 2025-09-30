import { EventEmitter } from "events";
import { randomUUID } from "crypto";
import {
    ConstructorOptions, FragrantEvents,
    FragrantStroage, FragrantArguments,
    InvalidFlagType, EmptyFlag, messageTypes } from "./options";

export class Fragrant extends EventEmitter {
    private workingOn: string[];
    private stroage: FragrantStroage[];
    private usage: string;
    private sensitivity: "high" | "low";

    constructor(opts: ConstructorOptions = { workingOn: process.argv }){
        super();
        this.workingOn = opts.workingOn ?? process.argv;
        this.stroage = [];
        this.usage = opts.usage ?? "";
        this.sensitivity = opts.sensitivity ?? "low";
    }

    on<K extends keyof FragrantEvents>(event: K, listener: FragrantEvents[K]): this {
        return super.on(event, listener);
    }

    emit<K extends keyof FragrantEvents>(event: K, ...args: Parameters<FragrantEvents[K]>): boolean {
        return super.emit(event, ...args);
    }

    getCurrentWorking(): string[] {
        return this.workingOn;
    }

    add(
        type: messageTypes,
        ...flags: string[]
    ): FragrantStroage[] {

        let appended: FragrantStroage[] = [];

        if (flags.length == 0){
            throw new EmptyFlag("flags list cannot be empty");
        }

        for (let flag of flags){
            if (!["call", "middle", "store"].includes(type)){
                throw new InvalidFlagType("Invalid flag type - call / middle / store");
            }

            if (!flag || flag.length == 0){
                throw new EmptyFlag("flag cannot be empty");
            }

            let id = randomUUID();

            this.stroage.push({
                flag,
                type,
                id: id
            });

            appended.push({
                flag,
                type,
                id: id
            });
        }

        return appended;
    }

    remove(...flag_ids: string[]): boolean {
        let deleted = false;
        for (let flag_id of flag_ids){
            for (let i = this.stroage.length - 1; i >= 0; i--) {
                if (this.stroage[i].id === flag_id) {
                    this.stroage.splice(i, 1);
                    deleted = true;
                }
            }
        }
        return deleted;
    }

    clear(): boolean {
        this.stroage = [];
        return true;
    }

    catchStorage(): FragrantStroage[] {
        return this.stroage;
    }

    parse(): void {
        let detected = false;
        for (let theStorage of this.stroage){
            let neededflag = theStorage.flag;
            if (theStorage.type == "store"){
                neededflag = neededflag + "=";
            }

            const arg = this.workingOn.find((thearg) => thearg.includes(neededflag));

            if (arg){
                if (theStorage.type == "call"){
                    if (this.eventNames().includes("find")){
                        this.emit("find", { type: theStorage.type, value: true, id: theStorage.id });
                        detected = true;
                    }
                } else if (theStorage.type == "store"){
                    if (this.eventNames().includes("find")){
                        if (arg.includes("=")){
                            const message = arg.split("=")[1];
                            this.emit("find", { type: theStorage.type, value: message, id: theStorage.id });
                            detected = true;
                        } else {
                            this.emit("find", { type: theStorage.type, value: undefined, id: theStorage.id });
                            detected = true;
                        }
                    }
                } else if (theStorage.type == "middle"){
                    if (this.eventNames().includes("find")){
                        const message = this.workingOn[this.workingOn.indexOf(arg) + 1];
                        this.emit("find", { type: theStorage.type, value: message, id: theStorage.id });
                        detected = true;
                    }
                }
            }
        }
        
        if (detected == false){
            if (this.sensitivity == "high"){
                console.log(this.usage);
                process.exit(0);
            }
        }
    }

}
