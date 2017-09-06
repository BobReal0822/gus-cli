"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("process");
const commander = require("commander");
const inquirer_1 = require("inquirer");
const command_1 = require("./command");
const utils_1 = require("./utils");
const InitData = {
    types: [
        'component',
        'app',
        'project'
    ]
};
commander.version(utils_1.getVersion());
commander.command('link:list <a> <b>')
    .alias('l')
    .action((name, options) => {
    utils_1.log('name & options: ', name, options);
});
commander.command('init')
    .description('init a project, which should be [lib | koa | express].')
    .option('-s, --setup_mode [mode]', 'Which setup mode to use')
    .action((name, options) => {
    inquirer_1.prompt([{
            type: 'list',
            name: 'initType',
            message: 'Select a type to init:',
            default: 0,
            choices: InitData.types
        }]).then(typeAnwser => {
        const initType = typeAnwser['initType'] || '';
        if (!initType || InitData.types.indexOf(initType) < 0) {
            return utils_1.log.error(`init type can't be null!`);
        }
        inquirer_1.prompt([{
                type: 'input',
                name: 'initName',
                message: `Input ${initType === 'app' ? 'an' : 'a'} ${initType} name to init:`,
                default: `gus-${initType}`
            }]).then(nameAnwser => {
            const initName = nameAnwser['initName'] || '';
            if (!initName) {
                return utils_1.log.error(`init name can't be null! \n`);
            }
            command_1.init(initType, initName);
        });
    });
});
commander.command('start <name>')
    .description('start a gus-fe project.')
    .option('-d, --dev', 'setup development environment')
    .action((name, options) => {
    command_1.start(name);
});
commander.command('test <dir> [otherDirs...]')
    .action((dir, otherDirs) => {
    utils_1.log('rmdir %s', dir);
});
commander.parse(process.argv);
//# sourceMappingURL=index.js.map