import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import * as Long from 'long';

export class MockProtoTimestamp extends Timestamp {
    seconds: Long;
    nanos: number;

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