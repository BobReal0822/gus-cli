"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ChildProcess = require("child_process");
const Process = require("process");
const chalk = require("chalk");
const Exec = ChildProcess.exec;
exports.DefaultInitOptions = {};
exports.InitNameMapping = {
    lib: {
        value: 'yo ts-lib',
        desc: ''
    },
    app: {
        value: 'yo gus-fe --color',
        desc: ''
    }
};
function init(name, options) {
    const command = exports.InitNameMapping[name];
    if (!name || !command) {
        return;
    }
    console.log('chalk enable: ', chalk.enabled);
    console.log(`
        run gus init ${chalk.yellow(name)} now:
        begin ${chalk.yellow(command.value)}${command.desc && chalk.gray(`(${command.desc})`)}
    `);
    const exec = Exec(command.value);
    exec.stdout.pipe(Process.stdout);
    exec.stderr.pipe(Process.stderr);
    exec.on('exit', code => {
        console.log(chalk.red('child process exited with code ' + code.toString()));
    });
}
exports.init = init;
//# sourceMappingURL=init.js.map