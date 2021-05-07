"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
/**
 * ChaincodeError
 */
class ChaincodeError extends Error {
    constructor(key, data, stack) {
        super(key);
        if (!_.isUndefined(stack)) {
            this.stack = stack;
        }
        this.data = data || {};
    }
    get serialized() {
        return JSON.stringify({
            'key': this.message,
            'data': this.data,
            'stack': this.stack
        });
    }
}
exports.ChaincodeError = ChaincodeError;
//# sourceMappingURL=ChaincodeError.js.map