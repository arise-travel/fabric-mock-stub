import {Timestamp} from 'fabric-shim';

export class MockTimeStamp implements Timestamp {
    public seconds: number;
    public nanos: number;

    public constructor(timeStamp: number) {
        this.seconds = Math.floor(timeStamp / 1000);
        this.nanos = (timeStamp - this.seconds * 1000) * 1000000;
    }
}