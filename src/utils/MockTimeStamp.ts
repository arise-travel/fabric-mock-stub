import {Timestamp} from 'fabric-shim';
import * as Long from 'long';

export class MockTimeStamp implements Timestamp {
    public seconds: Long;
    public nanos: number;

    public constructor(timeStamp: number) {
        this.seconds = Long.fromNumber(Math.floor(timeStamp / 1000));
        this.nanos = (timeStamp - this.seconds.toNumber() * 1000) * 1000000;
    }
}