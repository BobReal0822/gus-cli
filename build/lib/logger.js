"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
// tslint:disable-next-line
exports.log = (message, ...args) => console.log(message, ...args);
// tslint:disable-next-line
exports.log.error = (message, ...args) => console.log(chalk_1.default.bold.red(message), ...args);
// tslint:disable-next-line
exports.log.warning = (message, ...args) => console.log(chalk_1.default.bold.yellow(message), ...args);
//# sourceMappingURL=logger.js.map