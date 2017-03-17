"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Fs = require("fs");
const packagePath = Path.join(__dirname, './../..', 'package.json');
function getVersion() {
    let packageInfo = JSON.parse(Fs.readFileSync(packagePath, 'utf8'));
    return packageInfo && packageInfo.version || 'unvalid version';
}
exports.getVersion = getVersion;
//# sourceMappingURL=index.js.map