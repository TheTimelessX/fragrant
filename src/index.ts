import { EventEmitter } from "events";
import { randomUUID } from "crypto";
import {
    ConstructorOptions, FragrantEvents,
    FragrantStorage, FragrantArguments,
    InvalidFlagType, EmptyFlag, MessageTypes, FlagKind
} from "./options.js";

export class Fragrant extends EventEmitter {
    private workingOn: string[];
    private storage: FragrantStorage[];
    private usage: string;
    private sensitivity: "high" | "low";
    private emitUndefineds: boolean;

    constructor(opts: ConstructorOptions = { }) {
        super();
        this.workingOn = opts.workingOn ?? process.argv.slice(2);
        this.storage = [];
        this.usage = opts.usage ?? "";
        this.sensitivity = opts.sensitivity ?? "low";
        this.emitUndefineds = opts.emitUndefinedValues ?? true;
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
        type: MessageTypes,
        flags: { flag: string, kind?: FlagKind, help?: string }[]
    ): FragrantStorage[] {
        let appendeds: FragrantStorage[] = [];
        if (flags.length == 0) {
            throw new EmptyFlag("flags list cannot be empty");
        }

        for (let flag of flags){
            if (!["call", "middle", "store"].includes(type)) {
                throw new InvalidFlagType("Invalid flag type - call / middle / store");
            }

            if (!flag) {
                throw new EmptyFlag("flag cannot be empty");
            }

            let id = randomUUID();

            appendeds.push({
                id: id,
                flag: flag.flag,
                kind: flag.kind ?? "optional",
                help: flag.help,
                type
            });

            this.storage.push({
                id: id,
                flag: flag.flag,
                kind: flag.kind ?? "optional",
                help: flag.help,
                type
            });
        }

        return appendeds;
    }

    remove(...flag_ids: string[]): boolean {
        let deleted = false;
        for (let flag_id of flag_ids) {
            const i = this.storage.findIndex(f => f.id === flag_id);
            if (i !== -1) {
                this.storage.splice(i, 1);
                deleted = true;
            }
        }
        return deleted;
    }

    clear(): void {
        this.storage = [];
    }

    getLiteralFlags(){
        return this.storage.filter(flag => flag.kind === "literal");
    }

    parse(): void {
        let detected = false;

        for (const st of this.storage) {
            let neededflag = st.flag;
            if (st.type === "store") neededflag += "=";

            const arg = this.workingOn.find(a => a.startsWith(neededflag));

            if (arg) {
                detected = true;

                if (st.type === "call") {
                    this.emit("find", { type: st.type, value: true, id: st.id, flag: st.flag });
                }
                else if (st.type === "store") {
                    const value = arg.includes("=") ? arg.split("=")[1] : undefined;
                    if (value == undefined && this.emitUndefineds){
                        this.emit("find", { type: st.type, value, id: st.id, flag: st.flag });
                    } else if (value == undefined && !this.emitUndefineds){
                        return;
                        // wont emit anything
                    } else {
                        this.emit("find", { type: st.type, value, id: st.id, flag: st.flag });
                    }
                }
                else if (st.type === "middle") {
                    const idx = this.workingOn.indexOf(arg);
                    const value = this.workingOn[idx + 1];
                    if (value == undefined && this.emitUndefineds){
                        this.emit("find", { type: st.type, value, id: st.id, flag: st.flag });
                    } else if (value == undefined && !this.emitUndefineds){
                        return;
                        // wont emit anything
                    } else {
                        this.emit("find", { type: st.type, value, id: st.id, flag: st.flag });
                    }
                }
            } else if (st.kind == "literal") {
                if (this.sensitivity == "high"){
                    console.error(st.help ?? "invalid syntax detected while using program");
                    process.exit(0);
                }
            }
        }

        if (!detected && this.sensitivity === "high") {
            console.log(this.usage);
            process.exit(0);
        }
    }
}
