"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Process = require("process");
const inquirer_1 = require("inquirer");
const lib_1 = require("./../lib");
const util_1 = require("./../util");
const package_1 = require("./../package");
const build_1 = require("./build");
const projectType = util_1.getProjectInfo(Path.resolve('./')).type || '';
const config = util_1.getConfig(Path.resolve('./config.json'), build_1.DefaultWebsiteServerConfig);
const pathValidate = /^[\w\-\/\.]+$/;
const nameValidate = /^[\w\-]+$/;
const cmdMapping = {
    website: package_1.generateWebsitePage,
    spa: package_1.generateSpaPage
};
/**
 * Entry for command 'add'.
 *
 * @export
 * @param {string} type
 * @param {string} path
 * @param {string} name
 */
function add(path, name) {
    if (!projectType || !(projectType in cmdMapping)) {
        lib_1.log.error('Not a gus project!');
        Process.exit(1);
    }
    if (!path) {
        inputPath();
    }
    else if (!name) {
        inputName(path);
    }
    else {
        if (!pathValidate.test(path)) {
            lib_1.log.warning('Path input format error!');
            inputPath();
        }
        else if (!nameValidate.test(name)) {
            lib_1.log.warning('Name input format error!');
            inputName(path);
        }
        else {
            addModule(path, name);
        }
    }
}
exports.add = add;
/**
 * Input path for module.
 */
function inputPath() {
    inquirer_1.prompt([{
            type: 'input',
            name: 'path',
            message: 'Please input path:',
            default: `${projectType}-page`,
            validate: (input) => {
                return pathValidate.test(input) || 'Path input format error!';
            }
        }]).then((answer) => {
        inputName(answer['path'] || '');
    });
}
/**
 * Input name for module.
 *
 * @param {string} path
 */
function inputName(path) {
    inquirer_1.prompt([{
            type: 'input',
            name: 'name',
            message: 'Please input name:',
            default: `${projectType}-page`,
            validate: (input) => {
                return nameValidate.test(input) || 'Name input format error!';
            }
        }]).then((answer) => {
        const name = answer['name'] || '';
        addModule(path, name);
    });
}
/**
 * Add module by type, path & name.
 *
 * @param {string} type
 * @param {string} path
 * @param {string} name
 */
function addModule(path, name) {
    const func = cmdMapping[projectType];
    if (!func) {
        lib_1.log.error('Command not exist!');
        Process.exit(1);
    }
    func(path, name, config);
}
//# sourceMappingURL=add.js.map