import { Iterators } from 'fabric-shim';

export class MockKeyValue implements Iterators.KV {
    constructor(public key: string, public value: Buffer, public namespace: string) {
    }

    getKey(): string {
        return this.key;
    }
    getValue(): Buffer {
        return this.value;
    }
}