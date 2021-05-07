"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const queryEngine = require("@theledger/couchdb-query-engine");
const ChaincodeError_1 = require("./ChaincodeError");
const ChaincodeProposalCreator_1 = require("./ChaincodeProposalCreator");
const CompositeKeys_1 = require("./CompositeKeys");
const MockHistoryQueryIterator_1 = require("./MockHistoryQueryIterator");
const MockStateQueryIterator_1 = require("./MockStateQueryIterator");
const mockKeyModification_1 = require("./models/mockKeyModification");
const mockKeyValue_1 = require("./models/mockKeyValue");
const datatransform_1 = require("./utils/datatransform");
const helpers_1 = require("./utils/helpers");
const MockTimeStamp_1 = require("./utils/MockTimeStamp");
const defaultUserCert = '-----BEGIN CERTIFICATE-----' +
    'MIIB6TCCAY+gAwIBAgIUHkmY6fRP0ANTvzaBwKCkMZZPUnUwCgYIKoZIzj0EAwIw' +
    'GzEZMBcGA1UEAxMQZmFicmljLWNhLXNlcnZlcjAeFw0xNzA5MDgwMzQyMDBaFw0x' +
    'ODA5MDgwMzQyMDBaMB4xHDAaBgNVBAMTE015VGVzdFVzZXJXaXRoQXR0cnMwWTAT' +
    'BgcqhkjOPQIBBggqhkjOPQMBBwNCAATmB1r3CdWvOOP3opB3DjJnW3CnN8q1ydiR' +
    'dzmuA6A2rXKzPIltHvYbbSqISZJubsy8gVL6GYgYXNdu69RzzFF5o4GtMIGqMA4G' +
    'A1UdDwEB/wQEAwICBDAMBgNVHRMBAf8EAjAAMB0GA1UdDgQWBBTYKLTAvJJK08OM' +
    'VGwIhjMQpo2DrjAfBgNVHSMEGDAWgBTEs/52DeLePPx1+65VhgTwu3/2ATAiBgNV' +
    'HREEGzAZghdBbmlscy1NYWNCb29rLVByby5sb2NhbDAmBggqAwQFBgcIAQQaeyJh' +
    'dHRycyI6eyJhdHRyMSI6InZhbDEifX0wCgYIKoZIzj0EAwIDSAAwRQIhAPuEqWUp' +
    'svTTvBqLR5JeQSctJuz3zaqGRqSs2iW+QB3FAiAIP0mGWKcgSGRMMBvaqaLytBYo' +
    '9v3hRt1r8j8vN0pMcg==' +
    '-----END CERTIFICATE-----';
class ChaincodeMockStub {
    /**
     * @param {string} name - Name of the mockstub
     * @param {ChaincodeInterface} cc - Your chaincode
     * @param {string} [usercert] - User creds certificate with/without attributes
     */
    constructor(name, cc, usercert = defaultUserCert) {
        this.name = name;
        this.cc = cc;
        this.usercert = usercert;
        this.txID = '';
        this.state = new Map();
        this.transientMap = new Map();
        this.privateCollections = new Map();
        this.event = new Map();
        this.history = new Map();
        this.invokables = new Map();
        this.mspId = 'dummymspId';
        this.stateValidation = new Map();
        this.privatedataValidation = new Map();
        this.logger = helpers_1.Helpers.getLoggerInstance(this.name);
    }
    getPrivateDataHash(collection, key) {
        throw new Error('Method not implemented.');
    }
    /**
     * @returns {string}
     */
    getTxID() {
        return this.txID;
    }
    /**
     * @returns {string}
     */
    getMspID() {
        return this.mspId;
    }
    /**
     * @returns {string}
     */
    getMSPID() {
        return this.mspId;
    }
    /**
     * Get the current arguments
     *
     * @returns {string[]}
     */
    getArgs() {
        return this.args;
    }
    getSignedProposal() {
        return this.signedProposal;
    }
    mockInvokeWithSignedProposal(uuid, args, sp) {
        this.setSignedProposal(sp);
        return this.mockInvoke(uuid, args);
    }
    setSignedProposal(sp) {
        this.signedProposal = sp;
    }
    /**
     * Same as getArgs()
     *
     * @returns {string[]}
     */
    getStringArgs() {
        return this.args;
    }
    /**
     * @returns {{params: string[]; fcn: string}}
     */
    getFunctionAndParameters() {
        const params = this.getStringArgs();
        let fcn = '';
        if (params.length >= 1) {
            fcn = params[0];
            params.splice(0, 1);
        }
        return {
            fcn,
            params,
        };
    }
    /**
     * Used to indicate to a chaincode that it is part of a transaction.
     * This is important when chaincodes invoke each other.
     * MockStub doesn't support concurrent transactions at present.
     *
     * @param {string} txid
     * @param transientMap
     */
    mockTransactionStart(txid, transientMap) {
        this.txID = txid;
        this.setChaincodeProposal({});
        this.setTxTimestamp(new MockTimeStamp_1.MockTimeStamp(0));
        this.transientMap = transientMap;
    }
    /**
     * End a mocked transaction, clearing the UUID.
     *
     * @param {string} uuid
     */
    mockTransactionEnd(uuid) {
        this.signedProposal = null;
        this.txID = '';
        this.transientMap = new Map();
    }
    /**
     * Register a peer chaincode with this MockStub
     * invokableChaincodeName is the name or hash of the peer
     * otherStub is a MockStub of the peer, already intialised
     *
     * @param {string} invokableChaincodeName
     * @param {"fabric-shim".MockStub} otherStub
     */
    mockPeerChaincode(invokableChaincodeName, otherStub) {
        this.invokables[invokableChaincodeName] = otherStub;
    }
    /**
     * Initialise this chaincode,  also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param transientMap
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    mockInit(uuid, args, transientMap) {
        return __awaiter(this, void 0, void 0, function* () {
            this.args = args;
            this.mockTransactionStart(uuid, transientMap);
            const res = yield this.cc.Init(this);
            this.mockTransactionEnd(uuid);
            return res;
        });
    }
    /**
     * Invoke this chaincode, also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param transientMap
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    mockInvoke(uuid, args, transientMap) {
        return __awaiter(this, void 0, void 0, function* () {
            this.args = args;
            this.mockTransactionStart(uuid, transientMap);
            const res = yield this.cc.Invoke(this);
            this.mockTransactionEnd(uuid);
            return res;
        });
    }
    /**
     * InvokeChaincode calls a peered chaincode.
     *
     * @param {string} chaincodeName
     * @param {Buffer[]} args
     * @param {string} channel
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    invokeChaincode(chaincodeName, args, channel) {
        return __awaiter(this, void 0, void 0, function* () {
            // Internally we use chaincode name as a composite name
            if (channel != '') {
                chaincodeName = chaincodeName + '/' + channel;
            }
            const otherStub = this.invokables[chaincodeName];
            if (!otherStub) {
                throw new Error(`Chaincode ${chaincodeName} could not be found. Please create this using mockPeerChaincode.`);
            }
            return yield otherStub.mockInvoke(this.txID, args);
        });
    }
    /**
     * Invoke this chaincode, also starts and ends a transaction.
     *
     * @param {string} uuid
     * @param {string[]} args
     * @param {"fabric-shim".ChaincodeProposal.SignedProposal} sp
     * @returns {Promise<"fabric-shim".ChaincodeResponse>}
     */
    mockInvokeWithChaincodeProposal(uuid, args, sp) {
        return __awaiter(this, void 0, void 0, function* () {
            this.args = args;
            this.mockTransactionStart(uuid);
            this.signedProposal = sp;
            const res = yield this.cc.Invoke(this);
            this.mockTransactionEnd(uuid);
            return res;
        });
    }
    /**
     * Get a stored value for this key in the local state
     *
     * @param {string} key
     * @returns {Promise<Buffer>}
     */
    getState(key) {
        if (!this.state[key]) {
            return Promise.resolve(Buffer.from(''));
        }
        return Promise.resolve(this.state[key]);
    }
    /**
     * Store a value for this key in the local state
     *
     * @param {string} key
     * @param value
     * @returns {Promise<Buffer>}
     */
    putState(key, value) {
        if (this.txID == '') {
            return Promise.reject(new Error('Cannot putState without a transaction - call stub.mockTransactionStart()!'));
        }
        this.state[key] = value;
        if (!this.history[key]) {
            this.history[key] = [];
        }
        this.history[key].push(new mockKeyModification_1.MockKeyModification(false, value, this.txID));
        return Promise.resolve();
    }
    /**
     * DelState removes the specified `key` and its value from the ledger.
     *
     * @param {string} key
     * @returns {Promise<any>}
     */
    deleteState(key) {
        const value = this.state[key];
        this.history[key].push(new mockKeyModification_1.MockKeyModification(true, value, this.txID));
        delete this.state[key];
        return Promise.resolve();
    }
    /**
     * Get state by range of keys, empty keys will return everything
     *
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getStateByRange(startKey, endKey) {
        const items = Object.keys(this.state)
            .filter((k) => {
            const comp1 = helpers_1.Helpers.strcmp(k, startKey);
            const comp2 = helpers_1.Helpers.strcmp(k, endKey);
            return (comp1 >= 0 && comp2 <= 0) || (startKey == '' && endKey == '');
        })
            .map((k) => new mockKeyValue_1.MockKeyValue(k, this.state[k], ''));
        return Promise.resolve(new MockStateQueryIterator_1.MockStateQueryIterator(items, this.txID));
    }
    // tslint:disable-next-line:max-line-length
    getStateByRangeWithPagination(startKey, endKey, pageSize, bookmark) {
        return this.getStateByRange(startKey, endKey).then((iterator) => {
            return this.paginate(iterator, pageSize, bookmark);
        }).catch((error) => {
            throw error;
        });
    }
    /**
     *
     * GetQueryResult function can be invoked by a chaincode to perform a
     * rich query against state database.  Only supported by state database implementations
     * that support rich query.  The query string is in the syntax of the underlying
     * state database. An iterator is returned which can be used to iterate (next) over
     * the query result set.
     *
     * Blog post on writing rich queries -
     * https://medium.com/wearetheledger/hyperledger-fabric-couchdb-fantastic-queries-and-where-to-find-them-f8a3aecef767
     *
     * @param {string} query
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getQueryResult(query) {
        const keyValues = {};
        Object.keys(this.state)
            .forEach(k => {
            keyValues[k] = datatransform_1.Transform.bufferToObject(this.state[k]);
        });
        let parsedQuery;
        try {
            parsedQuery = JSON.parse(query);
        }
        catch (err) {
            throw new ChaincodeError_1.ChaincodeError('Error parsing query, should be string');
        }
        if (parsedQuery.sort) {
            this.logger.warn('Sorting might work using the mockstub, but on a live network you need to add an index to CouchDB');
        }
        const items = queryEngine.parseQuery(keyValues, parsedQuery)
            .map((item) => new mockKeyValue_1.MockKeyValue(item.key, datatransform_1.Transform.serialize(item.value), ''));
        return Promise.resolve(new MockStateQueryIterator_1.MockStateQueryIterator(items, this.txID));
    }
    // tslint:disable-next-line:max-line-length
    getQueryResultWithPagination(query, pageSize, bookmark) {
        return this.getQueryResult(query).then((iterator) => {
            return this.paginate(iterator, pageSize, bookmark);
        }).catch((error) => {
            throw error;
        });
    }
    /**
     * Retrieve state by partial keys
     *
     * @param {string} objectType
     * @param {string[]} attributes
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getStateByPartialCompositeKey(objectType, attributes) {
        const partialCompositeKey = CompositeKeys_1.CompositeKeys.createCompositeKey(objectType, attributes);
        return this.getStateByRange(partialCompositeKey, partialCompositeKey + CompositeKeys_1.CompositeKeys.MAX_UNICODE_RUNE_VALUE);
    }
    // tslint:disable-next-line:max-line-length
    getStateByPartialCompositeKeyWithPagination(objectType, attributes, pageSize, bookmark) {
        return this.getStateByPartialCompositeKey(objectType, attributes).then((iterator) => {
            return this.paginate(iterator, pageSize, bookmark);
        }).catch((error) => {
            throw error;
        });
    }
    createCompositeKey(objectType, attributes) {
        return CompositeKeys_1.CompositeKeys.createCompositeKey(objectType, attributes);
    }
    splitCompositeKey(compositeKey) {
        return CompositeKeys_1.CompositeKeys.splitCompositeKey(compositeKey);
    }
    getChaincodeProposal() {
        return this.signedProposal;
    }
    setChaincodeProposal(sp) {
        this.signedProposal = sp;
    }
    setTxTimestamp(timestamp) {
        this.txTimestamp = timestamp;
    }
    getTxTimestamp() {
        if (this.txTimestamp == null) {
            throw new Error('TxTimestamp not set.');
        }
        return this.txTimestamp;
    }
    /**
     * Store a mspId of the transaction's creator
     *
     * @param {string} mspId
     * @returns {void}
     */
    setCreator(mspId) {
        this.mspId = mspId;
    }
    getCreator() {
        return new ChaincodeProposalCreator_1.ChaincodeProposalCreator(this.mspId, this.usercert);
    }
    /**
     * GetHistory for key
     *
     * @param {string} key
     * @returns {Promise<"fabric-shim".Iterators.HistoryQueryIterator>}
     */
    getHistoryForKey(key) {
        return Promise.resolve(new MockHistoryQueryIterator_1.MockHistoryQueryIterator(this.history[key], this.txID));
    }
    /**
     * @todo Implement
     * @returns {string}
     */
    getBinding() {
        return undefined;
    }
    /**
     * Returns mocked transient values. These need to be set using the mockInvoke or mockTransactionStart
     *
     * @returns {Map<string, Buffer>}
     */
    getTransient() {
        return this.transientMap;
    }
    /**
     * Store the payload corresponding to an event name to the local event map
     *
     * @param {string} name
     * @param {Buffer} payload
     */
    setEvent(name, payload) {
        if (this.txID == '') {
            return Promise.reject(new Error('Cannot putState without a transaction - call stub.mockTransactionStart()!'));
        }
        this.event[name] = payload;
        return Promise.resolve();
    }
    /**
     * Get the stored payload for an event name in the local event map
     *
     * @returns {Promise<Buffer>}
     * @param name
     */
    getEvent(name) {
        return this.event[name];
    }
    /**
     * @todo Implement
     *
     * @returns {string}
     */
    getChannelID() {
        return undefined;
    }
    /**
     * Get a stored value for this key in the local state
     *
     * @param collection
     * @param {string} key
     * @returns {Promise<Buffer>}
     */
    getPrivateData(collection, key) {
        return (this.privateCollections[collection] || {})[key];
    }
    /**
     * Store a value for this key in the local state
     *
     * @param collection
     * @param {string} key
     * @param value
     * @returns {Promise<Buffer>}
     */
    putPrivateData(collection, key, value) {
        if (this.txID == '') {
            return Promise.reject('Cannot putState without a transaction - call stub.mockTransactionStart()!');
        }
        if (!this.privateCollections[collection]) {
            this.privateCollections[collection] = new Map();
        }
        this.privateCollections[collection][key] = value;
        return Promise.resolve();
    }
    /**
     * DelState removes the specified `key` and its value from the ledger.
     *
     * @param collection
     * @param {string} key
     * @returns {Promise<any>}
     */
    deletePrivateData(collection, key) {
        const value = (this.privateCollections[collection] || {})[key];
        if (value) {
            this.privateCollections[collection].delete(key);
        }
        return Promise.resolve();
    }
    /**
     * Get state by range of keys, empty keys will return everything
     *
     * @param collection
     * @param {string} startKey
     * @param {string} endKey
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getPrivateDataByRange(collection, startKey, endKey) {
        const privateCollection = this.privateCollections[collection] || {};
        const items = Object.keys(privateCollection)
            .filter((k) => {
            const comp1 = helpers_1.Helpers.strcmp(k, startKey);
            const comp2 = helpers_1.Helpers.strcmp(k, endKey);
            return (comp1 >= 0 && comp2 <= 0) || (startKey == '' && endKey == '');
        })
            .map((k) => new mockKeyValue_1.MockKeyValue(k, privateCollection[k], ''));
        return Promise.resolve(new MockStateQueryIterator_1.MockStateQueryIterator(items, this.txID));
    }
    /**
     *
     * GetQueryResult function can be invoked by a chaincode to perform a
     * rich query against state database.  Only supported by state database implementations
     * that support rich query.  The query string is in the syntax of the underlying
     * state database. An iterator is returned which can be used to iterate (next) over
     * the query result set.
     *
     * Blog post on writing rich queries -
     * https://medium.com/wearetheledger/hyperledger-fabric-couchdb-fantastic-queries-and-where-to-find-them-f8a3aecef767
     *
     * @param collection
     * @param {string} query
     * @returns {Promise<"fabric-shim".Iterators.StateQueryIterator>}
     */
    getPrivateDataQueryResult(collection, query) {
        const privateCollection = this.privateCollections[collection] || {};
        const keyValues = {};
        Object.keys(privateCollection)
            .forEach(k => {
            keyValues[k] = datatransform_1.Transform.bufferToObject(privateCollection[k]);
        });
        let parsedQuery;
        try {
            parsedQuery = JSON.parse(query);
        }
        catch (err) {
            throw new ChaincodeError_1.ChaincodeError('Error parsing query, should be string');
        }
        if (parsedQuery.sort) {
            this.logger.warn('Sorting might work using the mockstub, but on a live network you need to add an index' +
                ' to CouchDB. More info can be found here: http://hyperledger-fabric.readthedocs.io/en/release-1.1/' +
                'couchdb_as_state_database.html#using-couchdb-from-chaincode');
        }
        const items = queryEngine.parseQuery(keyValues, parsedQuery)
            .map((item) => new mockKeyValue_1.MockKeyValue(item.key, datatransform_1.Transform.serialize(item.value), ''));
        return Promise.resolve(new MockStateQueryIterator_1.MockStateQueryIterator(items, this.txID));
    }
    setStateValidationParameter(key, ep) {
        return __awaiter(this, void 0, void 0, function* () {
            this.stateValidation[key] = ep;
            this.logger.warn('Due to the complexity of endorsement policies, in our mockstub, we do not enforce the actual polcies on the mocked state.');
        });
    }
    getStateValidationParameter(key) {
        if (!this.stateValidation[key]) {
            return Promise.resolve(Buffer.from(''));
        }
        return Promise.resolve(this.stateValidation[key]);
    }
    setPrivateDataValidationParameter(collection, key, ep) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.privatedataValidation[collection]) {
                this.privatedataValidation[collection] = new Map();
            }
            this.logger.warn('Due to the complexity of endorsement policies, in our mockstub, we do not enforce the actual polcies on the mocked state.');
            this.privatedataValidation[collection][key] = ep;
        });
    }
    getPrivateDataValidationParameter(collection, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const policy = (this.privateCollections[collection] || {})[key];
            if (!policy) {
                return Promise.resolve(Buffer.from(''));
            }
            return Promise.resolve(policy);
        });
    }
    getPrivateDataByPartialCompositeKey(collection, objectType, attributes) {
        const partialCompositeKey = CompositeKeys_1.CompositeKeys.createCompositeKey(objectType, attributes);
        return this.getPrivateDataByRange(collection, partialCompositeKey, partialCompositeKey + CompositeKeys_1.CompositeKeys.MAX_UNICODE_RUNE_VALUE);
    }
    paginate(iterator, pageSize, bookmark) {
        const items = iterator.response.results;
        const start = bookmark ? parseInt(bookmark) * pageSize : 0;
        const pagedItems = items.slice(start, start + pageSize);
        return {
            iterator: new MockStateQueryIterator_1.MockStateQueryIterator(pagedItems, this.txID),
            metadata: {
                fetchedRecordsCount: items.length,
                bookmark: `${(start / pageSize) + 1}`
            }
        };
    }
}
exports.ChaincodeMockStub = ChaincodeMockStub;
//# sourceMappingURL=ChaincodeMockStub.js.map