"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timestamp_pb_1 = require("google-protobuf/google/protobuf/timestamp_pb");
class MockProtoTimestamp extends timestamp_pb_1.Timestamp {
    constructor() {
        super();
        this.seconds = Math.floor(Date.now() / 1000);
    }
    getSeconds() {
        return this.seconds;
    }
    toDate() {
        return new Date(this.seconds);
    }
}
exports.MockProtoTimestamp = MockProtoTimestamp;
//# sourceMappingURL=MockProtoTimestamp.js.map