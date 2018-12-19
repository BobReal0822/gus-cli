"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs-extra");
const Path = require("path");
/**
 * Get project type of the gus app from 'package.json'
 *
 * @export
 * @param {string} path
 * @returns {string}
 */
function getProjectInfo(path) {
    let res = {
        name: '',
        type: ''
    };
    const filePath = Path.resolve(path, 'package.json');
    if (path && Fs.pathExistsSync(filePath) && Fs.lstatSync(filePath).isFile()) {
        const packFile = Fs.readFileSync(filePath);
        if (packFile) {
            const { name, type } = JSON.parse(packFile.toString()) || {};
            res = Object.assign({}, {
                name,
                type
            });
        }
    }
    return res;
}
exports.getProjectInfo = getProjectInfo;
//# sourceMappingURL=cmd.js.map