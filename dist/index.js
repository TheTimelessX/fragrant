import { EventEmitter } from "events";
import { randomUUID } from "crypto";
import { InvalidFlagType, EmptyFlag } from "./options.js";
export class Fragrant extends EventEmitter {
    constructor(opts = { workingOn: process.argv }) {
        var _a, _b, _c;
        super();
        this.workingOn = (_a = opts.workingOn) !== null && _a !== void 0 ? _a : process.argv;
        if (this.workingOn == process.argv) {
            this.workingOn.splice(0, 1);
            this.workingOn.splice(1, 1);
        }
        this.stroage = [];
        this.usage = (_b = opts.usage) !== null && _b !== void 0 ? _b : "";
        this.sensitivity = (_c = opts.sensitivity) !== null && _c !== void 0 ? _c : "low";
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
    add(type, ...flags) {
        let appended = [];
        if (flags.length == 0) {
            throw new EmptyFlag("flags list cannot be empty");
        }
        for (let flag of flags) {
            if (!["call", "middle", "store"].includes(type)) {
                throw new InvalidFlagType("Invalid flag type - call / middle / store");
            }
            if (!flag || flag.length == 0) {
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
    remove(...flag_ids) {
        let deleted = false;
        for (let flag_id of flag_ids) {
            for (let i = this.stroage.length - 1; i >= 0; i--) {
                if (this.stroage[i].id === flag_id) {
                    this.stroage.splice(i, 1);
                    deleted = true;
                }
            }
        }
        return deleted;
    }
    clear() {
        this.stroage = [];
        return true;
    }
    catchStorage() {
        return this.stroage;
    }
    parse() {
        let detected = false;
        for (let theStorage of this.stroage) {
            let neededflag = theStorage.flag;
            if (theStorage.type == "store") {
                neededflag = neededflag + "=";
            }
            const arg = this.workingOn.find((thearg) => thearg.includes(neededflag));
            if (arg) {
                if (theStorage.type == "call") {
                    if (this.eventNames().includes("find")) {
                        this.emit("find", { type: theStorage.type, value: true, id: theStorage.id });
                        detected = true;
                    }
                }
                else if (theStorage.type == "store") {
                    if (this.eventNames().includes("find")) {
                        if (arg.includes("=")) {
                            const message = arg.split("=")[1];
                            this.emit("find", { type: theStorage.type, value: message, id: theStorage.id });
                            detected = true;
                        }
                        else {
                            this.emit("find", { type: theStorage.type, value: undefined, id: theStorage.id });
                            detected = true;
                        }
                    }
                }
                else if (theStorage.type == "middle") {
                    if (this.eventNames().includes("find")) {
                        const message = this.workingOn[this.workingOn.indexOf(arg) + 1];
                        this.emit("find", { type: theStorage.type, value: message, id: theStorage.id });
                        detected = true;
                    }
                }
            }
        }
        if (detected == false) {
            if (this.sensitivity == "high") {
                console.log(this.usage);
                process.exit(0);
            }
        }
    }
}
