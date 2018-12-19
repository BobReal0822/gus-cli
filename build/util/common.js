"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const child_process_1 = require("child_process");
const Process = require("process");
const Fs = require("fs-extra");
const packagePath = Path.join(__dirname, './../..', 'package.json');
/**
 * Get the version of gus.
 *
 * @export
 * @returns {string}
 */
function getVersion() {
    const packageInfo = JSON.parse(Fs.readFileSync(packagePath, 'utf8'));
    return packageInfo && packageInfo.version || 'Version invalid!';
}
exports.getVersion = getVersion;
/**
 * Execute commands by child_process.exec .
 *
 * @export
 * @param {string[]} cmds
 * @param {boolean} [noOut]
 */
function exeCmd(cmds, noOut) {
    cmds.map((cmd) => {
        if (cmd) {
            const exe = child_process_1.exec(`${cmd} --color`, {
                maxBuffer: 10 * 1024 * 1024
            });
            if (!noOut) {
                exe.stdout.pipe(Process.stdout);
                exe.on('exit', (code, signal) => {
                    // log.warning(`child process [ ${ cmd } ] exited with code ${ code.toString()}, signal: ${ signal }`);
                });
            }
            exe.stderr.pipe(Process.stderr);
            exe.on('error', (err) => {
                throw new Error(`${cmd}: ${err}`);
            });
        }
    });
}
exports.exeCmd = exeCmd;
/**
 * Get files under a dir.
 *
 * @export
 * @param {string} dir
 * @param {string} [originPath]
 * @returns {FileInfo[]}
 */
function getFiles(dir, originPath) {
    if (!Fs.statSync(dir).isDirectory()) {
        return [];
    }
    let res = [];
    const relativePath = originPath || dir;
    Fs.readdirSync(dir).map((item) => {
        const itemPath = Path.resolve(dir, item);
        const stat = Fs.statSync(itemPath);
        if (stat.isFile()) {
            const reg = /\.\w+$/;
            const ext = item && (reg.exec(item) || [])[0];
            const name = item.substr(0, item.length - ext.length);
            const path = Path.relative(relativePath, itemPath);
            res.push({
                name,
                ext,
                path
            });
        }
        else if (stat.isDirectory()) {
            res = [...res, ...getFiles(itemPath, relativePath)];
        }
    });
    return res;
}
exports.getFiles = getFiles;
//# sourceMappingURL=common.js.map