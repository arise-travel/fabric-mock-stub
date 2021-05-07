"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const MockProtoTimestamp_1 = require("../MockProtoTimestamp");
class MockKeyModification {
    // tslint:disable-next-line:variable-name
    constructor(isDelete, value, txId) {
        this.isDelete = isDelete;
        this.value = value;
        this.txId = txId;
        this.timestamp = new MockProtoTimestamp_1.MockProtoTimestamp();
    }
    getIsDelete() {
        return this.isDelete;
    }
    getValue() {
        return this.value;
    }
    getTimestamp() {
        return this.timestamp;
    }
    getTxId() {
        return this.txId;
    }
}
exports.MockKeyModification = MockKeyModification;
//# sourceMappingURL=mockKeyModification.js.map