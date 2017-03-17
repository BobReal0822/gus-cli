"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Cp = require("child_process");
exports.InitNames = {
    lib: 'lib',
    koa: 'koa',
    express: 'express'
};
;
exports.DefaultInitOptions = {};
function init(name, options) {
    if (!name) {
        return;
    }
    switch (name) {
        case exports.InitNames.lib:
            Cp.exec('yo ts-lib');
            break;
        default:
            '';
    }
}
exports.init = init;
//# sourceMappingURL=init.js.map