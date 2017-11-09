"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Fs = require("fs-extra");
const Path = require("path");
const config_1 = require("./../config");
const utils_1 = require("./../utils");
function stop(name) {
    const script = Path.resolve(config_1.AppConfig.appPath, `${name}.js`);
    if (!name || !Fs.existsSync(script)) {
        return utils_1.log.error(`app ${name} does not exist.`);
    }
    try {
        Fs.unlinkSync(script);
        utils_1.exeCmd(`pm2 stop ${name}`);
        utils_1.log(`stop ${name} successfully.`);
    }
    catch (err) {
        throw new Error(`stop ${name} failed: ${err}`);
    }
}
exports.stop = stop;
//# sourceMappingURL=stop.js.map