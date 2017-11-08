"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./../lib/server/app");
function start(name) {
    // return '';
    const options = {
        port: 5000
    };
    app_1.Server.initApp(name, options);
    app_1.Server.startApp(name);
}
exports.start = start;
//# sourceMappingURL=start.js.map