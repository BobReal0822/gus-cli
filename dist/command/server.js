"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./../lib/server/app");
function start(name) {
    const options = {
        port: 3002
    };
    app_1.Server.initApp(name, options);
    app_1.Server.startApp(name);
}
exports.start = start;
//# sourceMappingURL=server.js.map