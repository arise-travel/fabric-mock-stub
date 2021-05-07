"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
class CompositeKeys {
    static createCompositeKey(objectType, attributes) {
        CompositeKeys.validateCompositeKeyAttribute(objectType);
        if (!Array.isArray(attributes)) {
            throw new Error('attributes must be an array');
        }
        let compositeKey = CompositeKeys.COMPOSITEKEY_NS + objectType + CompositeKeys.MIN_UNICODE_RUNE_VALUE;
        attributes.forEach((attribute) => {
            CompositeKeys.validateCompositeKeyAttribute(attribute);
            compositeKey = compositeKey + attribute + CompositeKeys.MIN_UNICODE_RUNE_VALUE;
        });
        return compositeKey;
    }
    static splitCompositeKey(compositeKey) {
        let result = { objectType: null, attributes: [] };
        if (compositeKey && compositeKey.length > 1 && compositeKey.charAt(0) === CompositeKeys.COMPOSITEKEY_NS) {
            let splitKey = compositeKey.substring(1).split(CompositeKeys.MIN_UNICODE_RUNE_VALUE);
            if (splitKey[0]) {
                result.objectType = splitKey[0];
                splitKey.pop();
                if (splitKey.length > 1) {
                    splitKey.shift();
                    result.attributes = splitKey;
                }
            }
        }
        return result;
    }
    static validateCompositeKeyAttribute(attr) {
        if (!attr || typeof attr !== 'string' || attr.length === 0) {
            throw new Error('object type or attribute not a non-zero length string');
        }
        return attr.toString().length !== 0;
    }
}
exports.CompositeKeys = CompositeKeys;
CompositeKeys.MIN_UNICODE_RUNE_VALUE = '\u0000';
CompositeKeys.MAX_UNICODE_RUNE_VALUE = '\u{10ffff}';
CompositeKeys.COMPOSITEKEY_NS = '\x00';
CompositeKeys.EMPTY_KEY_SUBSTITUTE = '\x01';
//# sourceMappingURL=CompositeKeys.js.map