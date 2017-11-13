"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./../utils");
const app_1 = require("./../lib/server/app");
function dev(name) {
    const config = utils_1.getConfig(name);
    const options = Object.assign({}, config);
    app_1.App.init(name, options);
    app_1.App.serve(name);
}
exports.dev = dev;
//# sourceMappingURL=dev.js.map