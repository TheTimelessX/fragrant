import { EventEmitter } from "events";
import { randomUUID } from "crypto";
import { InvalidFlagType, EmptyFlag } from "./options.js";
export class Fragrant extends EventEmitter {
    constructor(opts = {}) {
        var _a, _b, _c, _d;
        super();
        this.workingOn = (_a = opts.workingOn) !== null && _a !== void 0 ? _a : process.argv.slice(2);
        this.storage = [];
        this.usage = (_b = opts.usage) !== null && _b !== void 0 ? _b : "";
        this.sensitivity = (_c = opts.sensitivity) !== null && _c !== void 0 ? _c : "low";
        this.emitUndefineds = (_d = opts.emitUndefinedValues) !== null && _d !== void 0 ? _d : true;
    }
    on(event, listener) {
        return super.on(event, listener);
    }
    emit(event, ...args) {
        return super.emit(event, ...args);
    }
    getCurrentWorking() {
        return this.workingOn;
    }
    add(type, flags) {
        var _a, _b;
        let appendeds = [];
        if (flags.length == 0) {
            throw new EmptyFlag("flags list cannot be empty");
        }
        for (let flag of flags) {
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
                kind: (_a = flag.kind) !== null && _a !== void 0 ? _a : "optional",
                help: flag.help,
                type
            });
            this.storage.push({
                id: id,
                flag: flag.flag,
                kind: (_b = flag.kind) !== null && _b !== void 0 ? _b : "optional",
                help: flag.help,
                type
            });
        }
        return appendeds;
    }
    remove(...flag_ids) {
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
    clear() {
        this.storage = [];
    }
    getLiteralFlags() {
        return this.storage.filter(flag => flag.kind === "literal");
    }
    parse() {
        var _a;
        let detected = false;
        for (const st of this.storage) {
            let neededflag = st.flag;
            if (st.type === "store")
                neededflag += "=";
            const arg = this.workingOn.find(a => a.startsWith(neededflag));
            if (arg) {
                detected = true;
                if (st.type === "call") {
                    this.emit("find", { type: st.type, value: true, id: st.id, flag: st.flag });
                }
                else if (st.type === "store") {
                    const value = arg.includes("=") ? arg.split("=")[1] : undefined;
                    if (value == undefined && this.emitUndefineds) {
                        this.emit("find", { type: st.type, value, id: st.id, flag: st.flag });
                    }
                    else if (value == undefined && !this.emitUndefineds) {
                        return;
                        // wont emit anything
                    }
                    else {
                        this.emit("find", { type: st.type, value, id: st.id, flag: st.flag });
                    }
                }
                else if (st.type === "middle") {
                    const idx = this.workingOn.indexOf(arg);
                    const value = this.workingOn[idx + 1];
                    if (value == undefined && this.emitUndefineds) {
                        this.emit("find", { type: st.type, value, id: st.id, flag: st.flag });
                    }
                    else if (value == undefined && !this.emitUndefineds) {
                        return;
                        // wont emit anything
                    }
                    else {
                        this.emit("find", { type: st.type, value, id: st.id, flag: st.flag });
                    }
                }
            }
            else if (st.kind == "literal") {
                if (this.sensitivity == "high") {
                    console.error((_a = st.help) !== null && _a !== void 0 ? _a : "invalid syntax detected while using program");
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
