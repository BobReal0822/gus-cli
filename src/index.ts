#!/usr/bin/env node

import * as chalk from 'chalk';
import * as cmd from 'commander';
import * as process from 'process';

import { init, start } from './commands';
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


// list


// start
cmd.command('start [name]')
  .description('start a gus-fe project.')
  .option('-d, --dev', 'setup development environment')
  .action((name: string, options: any) => {
    console.log('name & options in start: ', name, options);
    start(name);
  });

// stop


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
