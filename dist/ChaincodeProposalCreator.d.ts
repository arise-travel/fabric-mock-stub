import { SerializedIdentity } from 'fabric-shim';
/**
 * @hidden
 */
export declare class ChaincodeProposalCreator implements SerializedIdentity {
    private mspId;
    private signingId;
    idBytes: any;
    [fieldName: string]: any;
    mspid: string;
    constructor(mspId: string, signingId: string);
    getMspid(): string;
    getIdBytes(): any;
}
