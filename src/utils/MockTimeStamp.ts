import {Timestamp} from 'google-protobuf/google/protobuf/timestamp_pb';

export class MockTimeStamp extends Timestamp {
    public seconds: number;
    public nanos: number;
}