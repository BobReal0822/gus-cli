"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./../lib/server/app");
function start(name) {
    const options = {
        port: 5000
    };
    app_1.App.init(name, options);
    app_1.App.start(name);
}
exports.start = start;
//# sourceMappingURL=start.js.map