// typesrcipr library src index.

import * as process from 'process';
import * as commander from 'commander';

import { init } from './command';
import { getVersion } from './utils';

commander.version(getVersion());

commander.command('init <name>')
    .description('init a project, which should be [lib | koa | express].')
    .option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action((name: string, options: any) => {
        init(name);
    });

commander.command('test <dir> [otherDirs...]')
    .action((dir, otherDirs) => {
        console.log('rmdir %s', dir);
    });

commander.parse(process.argv);
