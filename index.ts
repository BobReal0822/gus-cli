#!/usr/bin/env node

import * as chalk from 'chalk';
import * as cmd from 'commander';
import * as process from 'process';

import { init, add, dev, build, publish } from './cmd';
import { log } from './lib';
import { getVersion } from './util';
import { exeCmd } from './util/common';

cmd.version(getVersion());

cmd.command('init [type] [name]')
  .description('Init an app, which should be [website | spa].')
  .option('-t, --typescript', 'Use typescript or not.')
  .action((type: string, name: string, options: any) => {
    init(type, name, options);
  });

cmd.command('add [path] [name]')
  .description('Add a page.')
  .action((path: string, name: string) => {
    add(path, name);
  });

cmd.command('build')
  .description('Build an app before deploying.')
  .option('-w, --watch', 'Build and watch.')
  .option('-p, --pre-deploy', 'Build and bind pre-deploy environment.')
  .action((options: { watch: boolean, preDeploy: boolean }) => {
    build(false, !!options.watch, !!options.preDeploy);
  });

cmd.command('dev')
  .description('Build and watch in development mode.')
  .action(() => {
    dev();
  });

cmd.command('publish')
  .description('Publish statics to CDN server, including js, css and images.')
  .option('-c, --clear', 'Clear the bucket before publish.')
  .action((options: any) => {
    publish(options && options.clear);
  });

cmd.command('*')
  .action((...args) => {
    args.pop();
    log.error(`  Error: command not found: ${ args.join(' ') }`);
    cmd.outputHelp();
  });

cmd.parse(process.argv);

if (!cmd.args.length) {
  cmd.outputHelp();
}
