"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *
 */
const Path = require("path");
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
    if (!type || !command) {
        return utils_1.log.error('command not found!');
    }
    utils_1.log(`
      run gus init ${chalk_1.default.yellow(type)} now:
      begin ${chalk_1.default.yellow(command.value)}${command.desc && chalk_1.default.gray(`(${command.desc})`)}
  `);
    utils_1.exeCmd([
        projectType === 'gus-project' && type === 'app' ? 'yo gus-project-app' : command.value
    ]);
}
//# sourceMappingURL=init.js.map