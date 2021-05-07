/// <reference types="node" />
import { Iterators } from 'fabric-shim';
export declare class MockKeyValue implements Iterators.KV {
    key: string;
    value: Buffer;
    namespace: string;
    constructor(key: string, value: Buffer, namespace: string);
    getKey(): string;
    getValue(): Buffer;
}
