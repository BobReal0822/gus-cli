#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd = require("commander");
const process = require("process");
const commands_1 = require("./commands");
const utils_1 = require("./utils");
process.stdin.setMaxListeners(100);
process.stdout.setMaxListeners(100);
process.stderr.setMaxListeners(100);
cmd.version(utils_1.getVersion());
// build
cmd.command('build [name]')
    .description('build an app.')
    .action((name, options) => {
    commands_1.build(name);
});
// dev
cmd.command('dev [name]')
    .description('build and watch an app in development mode.')
    .action((name, options) => {
    commands_1.dev(name);
});
// init
cmd.command('init [type] [name]')
    .description('init a project, which should be [lib | koa | express].')
    .option('-s, --setup_mode [mode]', 'Which setup mode to use')
    .action((type, name, options) => {
    console.log('type & name & options in Init: ', type, name);
    commands_1.init(type, name, options);
});
// start
cmd.command('start [name]')
    .description('start an app.')
    .action((name, options) => {
    commands_1.start(name);
});
// stop
cmd.command('stop [name]')
    .description('stop an app.')
    .action((name, options) => {
    commands_1.stop(name);
});
// tests
cmd.command('test <dir> [otherDirs...]')
    .action((dir, otherDirs) => {
    utils_1.log('rmdir %s', dir);
});
cmd.command('*')
    .action((...args) => {
    args.pop();
    utils_1.log.error(`  Error: ommand not found: ${args.join(' ')}`);
    cmd.outputHelp();
});
cmd.parse(process.argv);
if (!cmd.args.length) {
    cmd.outputHelp();
}
exports.GusCli = {};
//# sourceMappingURL=index.js.map