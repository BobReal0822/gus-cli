const yargs = require('yargs');

import { config } from './common';

const options = yargs
  .alias('p', 'optimize-minimize')
  .argv;

const appConfig: any = config();

if (!options.optimizeMinimize) {
  appConfig.devtool = 'source-map';
}

module.exports = appConfig;
