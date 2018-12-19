"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Fs = require("fs-extra");
const _ = require("lodash");
/**
 * Get server config data.
 *
 * @export
 * @param {string} path
 * @returns {T}
 */
function getConfig(path, defaultConfig) {
    if (!(path && Fs.pathExistsSync(path) && Fs.statSync(path).isFile())) {
        return _.cloneDeep(defaultConfig);
    }
    const config = JSON.parse(Fs.readFileSync(path, 'utf-8')) || {};
    return _.cloneDeep(Object.assign({}, defaultConfig, config));
}
exports.getConfig = getConfig;
function loadRoutes(path) {
    const fileRegex = /\.js$/;
    let data = [];
    if (Fs.pathExistsSync(path)) {
        Fs.readdirSync(path).map((file) => {
            if (file && fileRegex.test(file)) {
                const filePath = Path.resolve(path, file);
                if (Fs.statSync(filePath).isFile()) {
                    // tslint:disable-next-line
                    const module = require(filePath);
                    const defaultData = module && module.default || [];
                    if (defaultData && defaultData.length) {
                        data = data.concat(defaultData);
                    }
                }
                else if (Fs.statSync(filePath).isDirectory()) {
                    data = data.concat(loadRoutes(filePath));
                }
            }
        });
    }
    return data;
}
exports.loadRoutes = loadRoutes;
//# sourceMappingURL=package.js.map