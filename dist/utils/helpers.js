"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
/**
 * helper functions
 */
class Helpers {
    /**
     * Winston Logger with default level: debug
     *
     * @static
     * @param {string} name
     * @param {string} [level]
     * @returns {LoggerInstance}
     * @memberof Helpers
     */
    static getLoggerInstance(name, level) {
        return new winston_1.Logger({
            transports: [new winston_1.transports.Console({
                    level: level || 'debug',
                    prettyPrint: true,
                    json: false,
                    label: name,
                    colorize: true,
                })],
            exitOnError: false,
        });
    }
    /**
     * Check number of args
     * accepts array of numbers
     *
     * @static
     * @param {string[]} args
     * @param {(number | number[])} amount
     * @memberof Helpers
     */
    static checkArgs(args, amount) {
        if (Array.isArray(amount)) {
            if (!amount.filter(a => {
                return args.length === a;
            }).length) {
                throw new Error(`Incorrect number of arguments. Expecting ${amount}`);
            }
        }
        else {
            if (args.length != amount) {
                throw new Error(`Incorrect number of arguments. Expecting ${amount}`);
            }
        }
    }
    static strcmp(a, b) {
        if (a > b) {
            return 1;
        }
        if (a < b) {
            return -1;
        }
        // a must be equal to b
        return 0;
    }
}
exports.Helpers = Helpers;
//# sourceMappingURL=helpers.js.map