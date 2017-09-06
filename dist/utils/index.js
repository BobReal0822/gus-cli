"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Fs = require("fs");
const chalk = require("chalk");
const packagePath = Path.join(__dirname, './../..', 'package.json');
function getVersion() {
    const packageInfo = JSON.parse(Fs.readFileSync(packagePath, 'utf8'));
    return packageInfo && packageInfo.version || 'invalid version!';
}
exports.getVersion = getVersion;
exports.log = (message, ...args) => console.log(message, ...args);
exports.log.error = (message, ...args) => console.log(chalk.bold.red(message), ...args);
exports.log.warning = (message, ...args) => console.log(chalk.bold.yellow(message), ...args);
function getProjectType(path) {
    const packageInfo = JSON.parse(Fs.readFileSync(Path.resolve(path, 'package.json'), 'utf8'));
    return packageInfo && packageInfo.type || '';
}
exports.getProjectType = getProjectType;
//# sourceMappingURL=index.js.map