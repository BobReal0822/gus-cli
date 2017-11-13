"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const yargs = require('yargs');
const common_1 = require("./common");
const options = yargs
    .alias('p', 'optimize-minimize')
    .argv;
const appConfig = common_1.config();
if (!options.optimizeMinimize) {
    appConfig.devtool = 'source-map';
}
module.exports = appConfig;
//# sourceMappingURL=build.js.map