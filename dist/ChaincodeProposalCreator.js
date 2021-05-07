"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @hidden
 */
class ChaincodeProposalCreator {
    constructor(mspId, signingId) {
        this.mspId = mspId;
        this.signingId = signingId;
        this.idBytes = Buffer.from(signingId);
        // fabric-shim 1.3 makes a call to  toBuffer() in ClientIdentity constructor. We need to add this function to the id_bytes.
        this.idBytes.toBuffer = function () { return this; };
    }
    getMspid() {
        return this.mspId;
    }
    getIdBytes() {
        return this.idBytes;
    }
}
exports.ChaincodeProposalCreator = ChaincodeProposalCreator;
//# sourceMappingURL=ChaincodeProposalCreator.js.map