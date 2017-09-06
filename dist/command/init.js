"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const child_process_1 = require("child_process");
const Path = require("path");
const Process = require("process");
const utils_1 = require("./../utils");
const chalk = require("chalk");
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
const error = chalk.bold.red;
const warning = chalk.bold.yellow;
function init(type, name, options) {
    const command = exports.InitTypeMapping[type];
    const projectType = utils_1.getProjectType(Path.resolve(__dirname, './../..'));
    let exe;
    utils_1.log('_____this project type: ', projectType);
    if (!type || !command) {
        return utils_1.log.error('command not found!');
    }
    utils_1.log('chalk enable: ', chalk.enabled);
    utils_1.log(`
        run gus init ${chalk.yellow(type)} now:
        begin ${chalk.yellow(command.value)}${command.desc && chalk.gray(`(${command.desc})`)}
    `);
    exe = child_process_1.exec(projectType === 'gus-project' && type === 'app' ? 'yo gus-project-app' : command.value);
    exe.stdout.pipe(Process.stdout);
    exe.stderr.pipe(Process.stderr);
    exe.on('exit', code => {
        utils_1.log.error('child process exited with code ' + code.toString());
    });
}
exports.init = init;
//# sourceMappingURL=init.js.map