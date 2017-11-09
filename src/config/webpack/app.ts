const Path = require('path');
const Process = require('process');
const webpack = require('webpack');
const yargs = require('yargs');
// CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin,
// DefinePlugin = webpack.DefinePlugin,

import { config } from './common';

const options = yargs
  .alias('p', 'optimize-minimize')
  .argv;

const appConfig: any = config();


if (!options.optimizeMinimize) {
  appConfig.devtool = 'source-map';
}

module.exports = appConfig;
