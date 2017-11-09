"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require('path');
const Process = require('process');
const webpack = require('webpack');
const yargs = require('yargs');
// CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
// DefinePlugin = webpack.DefinePlugin,
const common_1 = require("./common");
const options = yargs
    .alias('p', 'optimize-minimize')
    .argv;
const appConfig = common_1.config();
if (!options.optimizeMinimize) {
    appConfig.devtool = 'source-map';
}
module.exports = appConfig;
//# sourceMappingURL=app.js.map