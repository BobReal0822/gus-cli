#!/usr/bin/env node

import * as chalk from 'chalk';
import * as cmd from 'commander';
import * as process from 'process';

import { init, start, stop, dev, build } from './commands';
import { getVersion, log, setMaxListeners } from './utils';

setMaxListeners();
cmd.version(getVersion());

cmd.command('build <app>')
  .option('-d, --dev', 'build in development mode.')
  .description('build an app.')
  .action((app: string, options: any) => {
    build(app, !!options.dev);
  });

cmd.command('dev <app>')
  .description('build and watch an app in development mode.')
  .action((app: string, options: any) => {
    dev(app);
  });

cmd.command('init [type] [app]')
  .description('init a project, which should be [lib | koa | express].')
  .option('-s, --setup_mode [mode]', 'Which setup mode to use')
  .action((type: string, app: string, options: any) => {
    init(type, name, options);
  });

cmd.command('start <app>')
  .description('start an app.')
  .action((app: string, options: any) => {
    start(app);
  });

cmd.command('stop <app>')
  .description('stop an app.')
  .action((app: string, options: any) => {
    stop(app);
  });

cmd.command('*')
  .action((...args) => {
    args.pop();
    log.error(`  Error: ommand not found: ${ args.join(' ') }`);
    cmd.outputHelp();
  });

cmd.parse(process.argv);

if (!cmd.args.length) {
  cmd.outputHelp();
}

export const GusCli = {};
