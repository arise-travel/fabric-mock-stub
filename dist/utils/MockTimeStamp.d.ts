import { Timestamp } from 'fabric-shim';
export declare class MockTimeStamp implements Timestamp {
    seconds: number;
    nanos: number;
    constructor(timeStamp: number);
}
