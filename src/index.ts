// typesrcipr library src index.

import * as process from 'process';
import * as commander from 'commander';
import * as chalk from 'chalk';
import { prompt, Question, Answers } from 'inquirer';

import { init, start } from './command';
import { getVersion, log } from './utils';

const InitData = {
    types: [
        'component',
        'app',
        'project'
    ]
};

commander.version(getVersion());

commander.command('link:list <a> <b>')
    .alias('l')
    .action((name, options) => {
        log('name & options: ', name, options);
    });

commander.command('init')
    .description('init a project, which should be [lib | koa | express].')
    .option('-s, --setup_mode [mode]', 'Which setup mode to use')
    .action((name: string, options: any) => {
        prompt([{
            type: 'list',
            name: 'initType',
            message: 'Select a type to init:',
            default: 0,
            choices: InitData.types
        }]).then(typeAnwser => {
            const initType = typeAnwser['initType'] || '';

            if (!initType || InitData.types.indexOf(initType) < 0) {
                return log.error(`init type can't be null!`);
            }

            prompt([{
                type: 'input',
                name: 'initName',
                message: `Input ${ initType === 'app' ? 'an' : 'a' } ${ initType } name to init:`,
                default: `gus-${ initType }`
            }]).then(nameAnwser => {
                const initName = nameAnwser['initName'] || '';

                if (!initName) {
                    return log.error(`init name can't be null! \n`);
                }

                init(initType, initName);
            });
        });
        // init(name);
    });

commander.command('start <name>')
    .description('start a gus-fe project.')
    .option('-d, --dev', 'setup development environment')
    .action((name: string, options: any) => {
        start(name);
    });

commander.command('test <dir> [otherDirs...]')
    .action((dir, otherDirs) => {
        log('rmdir %s', dir);
    });

commander.parse(process.argv);
