/// <reference types="node" />
import { Iterators } from 'fabric-shim';
import { MockTimeStamp } from '../utils/MockTimeStamp';
export declare class MockKeyModification implements Iterators.KeyModification {
    isDelete: boolean;
    value: Buffer;
    txId: string;
    timestamp: MockTimeStamp;
    constructor(isDelete: boolean, value: Buffer, txId: string);
    getIsDelete(): boolean;
    getValue(): Buffer;
    getTimestamp(): MockTimeStamp;
    getTxId(): string;
}
