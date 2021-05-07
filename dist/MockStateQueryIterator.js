"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
class MockStateQueryIterator {
    constructor(data, txID) {
        this.data = data;
        this.txID = txID;
        this.currentLoc = 0;
        this.closed = false;
    }
    get response() {
        return {
            results: this.data,
            has_more: this.data.length - (this.currentLoc + 1) >= 0,
            metadata: Buffer.from(''),
            id: 'mockId'
        };
    }
    next() {
        if (this.closed) {
            throw new Error('Iterator has already been closed');
        }
        this.currentLoc++;
        return Promise.resolve({
            value: this.data[this.currentLoc - 1],
            done: this.data.length <= this.currentLoc
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.closed = true;
        });
    }
    addListener(event, listener) {
        throw new Error('Method not implemented.');
    }
    on(event, listener) {
        throw new Error('Method not implemented.');
    }
    once(event, listener) {
        throw new Error('Method not implemented.');
    }
    prependListener(event, listener) {
        throw new Error('Method not implemented.');
    }
    prependOnceListener(event, listener) {
        throw new Error('Method not implemented.');
    }
    removeListener(event, listener) {
        throw new Error('Method not implemented.');
    }
    off(event, listener) {
        throw new Error('Method not implemented.');
    }
    removeAllListeners(event) {
        throw new Error('Method not implemented.');
    }
    setMaxListeners(n) {
        throw new Error('Method not implemented.');
    }
    getMaxListeners() {
        throw new Error('Method not implemented.');
    }
    listeners(event) {
        throw new Error('Method not implemented.');
    }
    rawListeners(event) {
        throw new Error('Method not implemented.');
    }
    emit(event, ...args) {
        throw new Error('Method not implemented.');
    }
    eventNames() {
        throw new Error('Method not implemented.');
    }
    listenerCount(type) {
        throw new Error('Method not implemented.');
    }
}
exports.MockStateQueryIterator = MockStateQueryIterator;
//# sourceMappingURL=MockStateQueryIterator.js.map