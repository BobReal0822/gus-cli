"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Process = require("process");
const inquirer_1 = require("inquirer");
const chalk_1 = require("chalk");
const lib_1 = require("./../lib");
const util_1 = require("./../util");
exports.InitTypeMapping = {
    website: {
        cmd: `yo ${Path.resolve(__dirname, './../..', 'node_modules/generator-ws-app//generators/app/index.js')}`,
        desc: 'yo ws-app'
    },
    spa: {
        cmd: `yo ${Path.resolve(__dirname, './../..', 'node_modules/generator-spa-app//generators/app/index.js')}`,
        desc: 'yo spa-app'
    }
};
/**
 * Entry for command 'init'.
 *
 * @export
 * @param {string} type
 * @param {string} name
 * @param {*} [options]
 */
function init(type, name, options) {
    if (!type) {
        selectProject();
    }
    else if (!name) {
        inputName(type);
    }
    else if (type in exports.InitTypeMapping) {
        generate(type, name);
    }
    else {
        lib_1.log.error(`Error, init type is invalid: ${type}`);
    }
}
exports.init = init;
/**
 * Select project type for command 'init', should be 'website' or 'spa(single page application)'.
 */
function selectProject() {
    inquirer_1.prompt([{
            type: 'list',
            name: 'project',
            message: 'Please select project type:',
            default: 0,
            choices: Object.keys(exports.InitTypeMapping)
        }]).then((answer) => {
        inputName(answer['project'] || '');
    });
}
/**
 * Input a name for the project.
 *
 * @param {string} type
 */
function inputName(type) {
    if (!(type in exports.InitTypeMapping)) {
        lib_1.log.error('Command not found!');
        Process.exit(1);
    }
    inquirer_1.prompt([{
            type: 'input',
            name: 'name',
            message: `Please input ${type} name:`,
            default: `gus-${type}`,
            validate: (input) => {
                return /^[\w\-]+$/.test(input) || 'Input format error!';
            }
        }]).then((nameAnswer) => {
        const name = nameAnswer['name'] || '';
        if (!name) {
            return lib_1.log.error(`${type} name can't be null! \n`);
        }
        generate(type, name);
    });
}
/**
 * Generate project by it's type and name.
 *
 * @param {string} type
 * @param {string} name
 * @param {InitOptionsInterface} [options]
 */
function generate(type, name, options) {
    const command = exports.InitTypeMapping[type];
    if (!type || !command) {
        lib_1.log.error('Command not found!');
        Process.exit(1);
    }
    lib_1.log(`
    run gus init ${type} ${chalk_1.default.yellow(name)} now:
    begin to ${chalk_1.default.yellow(command.desc)}
  `);
    util_1.exeCmd([command.cmd]);
}
//# sourceMappingURL=init.js.map