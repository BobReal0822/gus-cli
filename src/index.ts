#!/usr/bin/env node

import * as chalk from 'chalk';
import * as cmd from 'commander';
import * as process from 'process';

import { init, start, stop } from './commands';
import { getVersion, log } from './utils';

cmd.version(getVersion());

// dev


// init
cmd.command('init [type] [name]')
  .description('init a project, which should be [lib | koa | express].')
  .option('-s, --setup_mode [mode]', 'Which setup mode to use')
  .action((type: string, name: string, options: any) => {
    console.log('type & name & options in Init: ', type, name);

    init(type, name, options);
  });

// start
cmd.command('start [name]')
  .description('start an app.')
  .action((name: string, options: any) => {
    start(name);
  });

// stop
cmd.command('stop [name]')
  .description('stop an app.')
  .action((name: string, options: any) => {
    stop(name);
  });

// tests
cmd.command('test <dir> [otherDirs...]')
  .action((dir, otherDirs) => {
    log('rmdir %s', dir);
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
