"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
const app_1 = require("./../lib/server/app");
function start(name) {
    const config = utils_1.getConfig(name);
    const options = Object.assign({}, config.server);
    app_1.App.init(name, options);
    app_1.App.start(name);
}
exports.start = start;
//# sourceMappingURL=start.js.map