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
const _ = require("lodash");
const helpers_1 = require("./helpers");
/**
 * The Transform class is a helper to provide data transformation to and from the formats required by hyperledger fabric.
 */
class Transform {
    /**
     * serialize payload
     *
     * @static
     * @param {*} value
     * @returns
     * @memberof Transform
     */
    static serialize(value) {
        if (value instanceof Buffer) {
            return value;
        }
        else if (_.isDate(value) || _.isString(value)) {
            return Buffer.from(this.normalizePayload(value).toString());
        }
        return Buffer.from(JSON.stringify(this.normalizePayload(value)));
    }
    /**
     * parse string to object
     *
     * @static
     * @param {Buffer} buffer
     * @returns {(object | undefined)}
     * @memberof Transform
     */
    static bufferToObject(buffer) {
        if (buffer == null) {
            return null;
        }
        if (Number(parseFloat(buffer.toString())) === buffer) {
            return buffer;
        }
        const bufferString = buffer.toString('utf8');
        if (bufferString.length <= 0) {
            return null;
        }
        try {
            return JSON.parse(bufferString);
        }
        catch (err) {
            this.logger.error('Error parsing buffer to JSON', bufferString);
            return bufferString;
        }
    }
    static uInt8ArrayToObject(payload) {
        if (payload === null) {
            return null;
        }
        if (Number(parseFloat(payload.toString())) === payload) {
            return payload;
        }
        const payloadString = payload.toString();
        if (payloadString.length <= 0) {
            return null;
        }
        try {
            return JSON.parse(payloadString);
        }
        catch (err) {
            this.logger.error('Error parsing Uint8Array to JSON', payloadString);
            return payloadString;
        }
    }
    /**
     * bufferToDate
     *
     * @static
     * @param {Buffer} buffer
     * @returns {(Date | undefined)}
     * @memberof Transform
     */
    static bufferToDate(buffer) {
        if (buffer == null) {
            return;
        }
        const bufferString = buffer.toString();
        if (bufferString.length <= 0) {
            return;
        }
        if (/\d+/g.test(bufferString)) {
            return new Date(parseInt(bufferString, 10));
        }
        return;
    }
    static bufferToString(buffer) {
        if (buffer == null) {
            return null;
        }
        return buffer.toString();
    }
    /**
     * Transform iterator to array of objects
     *
     * @param {'fabric-shim'.Iterators.Iterator} iterator
     * @returns {Promise<Array>}
     */
    static iteratorToList(iterator) {
        return __awaiter(this, void 0, void 0, function* () {
            const allResults = [];
            let res;
            while (res == null || !res.done) {
                res = yield iterator.next();
                if (res.value && res.value.value.toString()) {
                    let parsedItem;
                    try {
                        parsedItem = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err) {
                        parsedItem = res.value.value.toString('utf8');
                    }
                    allResults.push(parsedItem);
                }
            }
            yield iterator.close();
            return allResults;
        });
    }
    /**
     * Transform iterator to array of objects
     *
     * @param {'fabric-shim'.Iterators.Iterator} iterator
     * @returns {Promise<Array>}
     */
    static iteratorToKVList(iterator) {
        return __awaiter(this, void 0, void 0, function* () {
            const allResults = [];
            let res;
            while (res == null || !res.done) {
                res = yield iterator.next();
                if (res.value && res.value.value.toString()) {
                    let parsedItem = { key: '', value: {} };
                    parsedItem.key = res.value.key;
                    try {
                        parsedItem.value = JSON.parse(res.value.value.toString('utf8'));
                    }
                    catch (err) {
                        parsedItem.value = res.value.value.toString('utf8');
                    }
                    allResults.push(parsedItem);
                }
            }
            yield iterator.close();
            return allResults;
        });
    }
    /**
     * Transform iterator to array of objects
     *
     * @param {'fabric-shim'.Iterators.HistoryQueryIterator} iterator
     * @returns {Promise<Array>}
     */
    static iteratorToHistoryList(iterator) {
        return __awaiter(this, void 0, void 0, function* () {
            const allResults = [];
            let res;
            while (res == null || !res.done) {
                res = yield iterator.next();
                if (res.value && res.value.value.toString()) {
                    let parsedItem = {
                        is_delete: false,
                        value: {},
                        timestamp: null,
                        tx_id: ''
                    };
                    try {
                        parsedItem.value = JSON.parse(res.value.value.toString());
                    }
                    catch (err) {
                        parsedItem.value = res.value.value.toString();
                    }
                    parsedItem.is_delete = res.value.isDelete;
                    parsedItem.tx_id = res.value.txId;
                    parsedItem.timestamp = res.value.timestamp.seconds;
                    allResults.push(parsedItem);
                }
            }
            yield iterator.close();
            return allResults;
        });
    }
    /**
     * normalizePayload
     *
     * @static
     * @param {*} value
     * @returns {*}
     * @memberof Transform
     */
    static normalizePayload(value) {
        if (_.isDate(value)) {
            return value.getTime();
        }
        else if (_.isString(value)) {
            return value;
        }
        else if (_.isArray(value)) {
            return _.map(value, (v) => {
                return this.normalizePayload(v);
            });
        }
        else if (_.isObject(value)) {
            return _.mapValues(value, (v) => {
                return this.normalizePayload(v);
            });
        }
        return value;
    }
}
exports.Transform = Transform;
Transform.logger = helpers_1.Helpers.getLoggerInstance('Transform', 'info');
//# sourceMappingURL=datatransform.js.map