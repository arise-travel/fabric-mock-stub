import {Iterators} from 'fabric-shim';
import {Timestamp} from 'google-protobuf/google/protobuf/timestamp_pb';
import {MockProtoTimestamp} from '../MockProtoTimestamp';
import {MockTimeStamp} from '../utils/MockTimeStamp';

export class MockKeyModification implements Iterators.KeyModification {

    public timestamp: MockTimeStamp;

    // tslint:disable-next-line:variable-name
    constructor(public isDelete: boolean, public value: Buffer, public txId: string) {
        this.timestamp = new MockProtoTimestamp();
    }

    getIsDelete(): boolean {
        return this.isDelete;
    }

    getValue(): Buffer {
        return this.value;
    }

    getTimestamp(): Timestamp {
        return this.timestamp;
    }

    getTxId(): string {
        return this.txId;
    }
}