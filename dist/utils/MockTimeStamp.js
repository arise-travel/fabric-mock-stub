"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Long = require("long");
class MockTimeStamp {
    constructor(timeStamp) {
        this.seconds = Long.fromNumber(Math.floor(timeStamp / 1000));
        this.nanos = (timeStamp - this.seconds.toNumber() * 1000) * 1000000;
    }
}
exports.MockTimeStamp = MockTimeStamp;
//# sourceMappingURL=MockTimeStamp.js.map