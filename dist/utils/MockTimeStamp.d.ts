import { Timestamp } from 'fabric-shim';
import * as Long from 'long';
export declare class MockTimeStamp implements Timestamp {
    seconds: Long;
    nanos: number;
    constructor(timeStamp: number);
}
