"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timestamp_pb_1 = require("google-protobuf/google/protobuf/timestamp_pb");
const Long = require("long");
class MockProtoTimestamp extends timestamp_pb_1.Timestamp {
    constructor() {
        super();
        this.seconds = Long.fromNumber(Math.floor(Date.now() / 1000));
    }
    getSeconds() {
        return this.seconds.toNumber();
    }
    toDate() {
        return new Date(this.seconds.toNumber());
    }
}
exports.MockProtoTimestamp = MockProtoTimestamp;
//# sourceMappingURL=MockProtoTimestamp.js.map