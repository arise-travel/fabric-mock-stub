"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockTimeStamp {
    constructor(timeStamp) {
        this.seconds = Math.floor(timeStamp / 1000);
        this.nanos = (timeStamp - this.seconds * 1000) * 1000000;
    }
}
exports.MockTimeStamp = MockTimeStamp;
//# sourceMappingURL=MockTimeStamp.js.map