import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import * as Long from 'long';
export declare class MockProtoTimestamp extends Timestamp {
    seconds: Long;
    nanos: number;
    constructor();
    getSeconds(): number;
    toDate(): Date;
}
