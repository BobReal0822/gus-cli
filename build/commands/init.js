"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const child_process_1 = require("child_process");
const Path = require("path");
const Process = require("process");
const inquirer_1 = require("inquirer");
const chalk_1 = require("chalk");
const utils_1 = require("./../utils");
exports.DefaultInitOptions = {};
exports.InitTypeMapping = {
    component: {
        value: 'yo gus-component',
        desc: ''
    },
    app: {
        value: 'yo gus-app --color',
        desc: ''
    },
    project: {
        value: 'yo gus-project',
        desc: ''
    },
    server: {
        value: 'yo gus-server',
        desc: ''
    },
    lib: {
        value: 'yo ts-lib',
        desc: ''
    }
};
const InitData = {
    types: [
        'component',
        'app',
        'project'
    ]
};
const error = chalk_1.default.bold.red;
const warning = chalk_1.default.bold.yellow;
function init(type, name, options) {
    if (!type) {
        selectType();
    }
    else if (!name) {
        selectName(type);
    }
    else if (InitData.types.indexOf(type) > -1) {
        console.log('should generate now: ', type, name);
        generate(type, name);
    }
    else {
        utils_1.log.error(`Error, init type is invalid: ${type}`);
    }
}
exports.init = init;
function selectType() {
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
        selectName(initType);
    });
}
function selectName(type) {
    inquirer_1.prompt([{
            type: 'input',
            name: 'initName',
            message: `Input ${type === 'app' ? 'an' : 'a'} ${type} name to init:`,
            default: `gus-${type}`
        }]).then(nameAnwser => {
        const initName = nameAnwser['initName'] || '';
        if (!initName) {
            return utils_1.log.error(`init name can't be null! \n`);
        }
        generate(type, initName);
    });
}
function generate(type, name, options) {
    const command = exports.InitTypeMapping[type];
    const projectType = utils_1.getProjectType(Path.resolve(__dirname, './../..'));
    let exe;
    utils_1.log('_____this project type: ', projectType);
    if (!type || !command) {
        return utils_1.log.error('command not found!');
    }
    utils_1.log('chalk enable: ', chalk_1.default.enabled);
    utils_1.log(`
        run gus init ${chalk_1.default.yellow(type)} now:
        begin ${chalk_1.default.yellow(command.value)}${command.desc && chalk_1.default.gray(`(${command.desc})`)}
    `);
    exe = child_process_1.exec(projectType === 'gus-project' && type === 'app' ? 'yo gus-project-app' : command.value);
    exe.stdout.pipe(Process.stdout);
    exe.stderr.pipe(Process.stderr);
    exe.on('exit', code => {
        utils_1.log.error('child process exited with code ' + code.toString());
    });
}
//# sourceMappingURL=init.js.map