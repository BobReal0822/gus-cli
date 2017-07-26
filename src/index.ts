// typesrcipr library src index.

import * as process from 'process';
import * as commander from 'commander';
import * as chalk from 'chalk';

import { init, start } from './command';
import { getVersion } from './utils';

commander.version(getVersion());

commander.command('link:list <a> <b>')
    .alias('l')
    .action((name, options) => {
        console.log('name & options: ', name, options);
    });

commander.command('init <name>')
    .description('init a project, which should be [lib | koa | express].')
    .option('-s, --setup_mode [mode]', 'Which setup mode to use')
    .action((name: string, options: any) => {
        init(name);
    });

commander.command('start <path>')
    .description('start a gus-fe project.')
    .option('-d, --dev', 'setup development environment')
    .action((name: string, options: any) => {
        start(name);
    });

commander.command('test <dir> [otherDirs...]')
    .action((dir, otherDirs) => {
        console.log('rmdir %s', dir);
    });

commander.parse(process.argv);
