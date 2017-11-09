"use strict";
/**
 * utils for gus-cli
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Fs = require("fs");
const Path = require("path");
const child_process_1 = require("child_process");
const Process = require("process");
const packagePath = Path.join(__dirname, './../..', 'package.json');
/**
 * Get package version.
 *
 * @export getVersion
 * @returns {string}
 */
function getVersion() {
    const packageInfo = JSON.parse(Fs.readFileSync(packagePath, 'utf8'));
    return packageInfo && packageInfo.version || 'invalid version!';
}
exports.getVersion = getVersion;
exports.log = (message, ...args) => console.log(message, ...args);
exports.log.error = (message, ...args) => console.log(chalk_1.default.bold.red(message), ...args);
exports.log.warning = (message, ...args) => console.log(chalk_1.default.bold.yellow(message), ...args);
function getProjectType(path) {
    const packageInfo = JSON.parse(Fs.readFileSync(Path.resolve(path, 'package.json'), 'utf8'));
    return packageInfo && packageInfo.type || '';
}
exports.getProjectType = getProjectType;
function exeCmd(cmd) {
    const exe = child_process_1.exec(cmd);
    exe.stdout.pipe(Process.stdout);
    exe.stderr.pipe(Process.stderr);
    exe.on('error', err => {
        throw new Error(`in exeCmd: ${err}`);
    });
    exe.on('exit', code => {
        exports.log.error('child process exited with code ' + code.toString());
    });
}
exports.exeCmd = exeCmd;
//# sourceMappingURL=common.js.map