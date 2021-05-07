"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MockKeyValue {
    constructor(key, value, namespace) {
        this.key = key;
        this.value = value;
        this.namespace = namespace;
    }
    getKey() {
        return this.key;
    }
    getValue() {
        return this.value;
    }
}
exports.MockKeyValue = MockKeyValue;
//# sourceMappingURL=mockKeyValue.js.map