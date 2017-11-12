#!/usr/bin/env node

import * as chalk from 'chalk';
import * as cmd from 'commander';
import * as process from 'process';

import { init, start, stop, dev, build, serve } from './commands';
import { getVersion, log, setMaxListeners } from './utils';

setMaxListeners();
cmd.version(getVersion());

// build
cmd.command('build <app>')
  .description('build an app.')
  .action((app: string, options: any) => {
    build(app);
  });

// dev
cmd.command('dev <app>')
  .description('build and watch an app in development mode.')
  .action((app: string, options: any) => {
    dev(app);
  });

// init
cmd.command('init [type] [app]')
  .description('init a project, which should be [lib | koa | express].')
  .option('-s, --setup_mode [mode]', 'Which setup mode to use')
  .action((type: string, app: string, options: any) => {
    console.log('type & app & options in Init: ', type, app);

    init(type, name, options);
  });

// serve
cmd.command('serve <app>')
.description('start a serve for gus app.')
.action((app: string, options: any) => {
  console.log('app in serve: ', app);
  serve(app);
});

// start
cmd.command('start <app>')
  .description('start an app.')
  .action((app: string, options: any) => {
    console.log('app in start: ', app);
    start(app);
  });

// stop
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
