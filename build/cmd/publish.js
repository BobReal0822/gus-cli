"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const util_1 = require("./../util");
const package_1 = require("./../package");
const config_1 = require("./../config");
const _1 = require("./");
/**
 * Entry for command publish.
 *
 * @export
 * @param {boolean} clear
 */
function publish(clear) {
    return __awaiter(this, void 0, void 0, function* () {
        const config = util_1.getConfig(Path.resolve('./config.json'), _1.DefaultWebsiteServerConfig);
        const { server, outDir } = config;
        const staticGlob = Path.resolve(outDir, server.static);
        const relativeGlob = Path.resolve(outDir);
        const oss = new package_1.OSS(config_1.OSSConfig);
        if (clear) {
            yield oss.delete(staticGlob, relativeGlob);
        }
        yield oss.upload(staticGlob, relativeGlob);
    });
}
exports.publish = publish;
//# sourceMappingURL=publish.js.map