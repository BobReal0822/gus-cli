#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cmd = require("commander");
const process = require("process");
const cmd_1 = require("./cmd");
const lib_1 = require("./lib");
const util_1 = require("./util");
cmd.version(util_1.getVersion());
cmd.command('init [type] [name]')
    .description('Init an app, which should be [website | spa].')
    .option('-t, --typescript', 'Use typescript or not.')
    .action((type, name, options) => {
    cmd_1.init(type, name, options);
});
cmd.command('add [path] [name]')
    .description('Add a page.')
    .action((path, name) => {
    cmd_1.add(path, name);
});
cmd.command('build')
    .description('Build an app before deploying.')
    .option('-w, --watch', 'Build and watch.')
    .option('-p, --pre-deploy', 'Build and bind pre-deploy environment.')
    .action((options) => {
    cmd_1.build(false, !!options.watch, !!options.preDeploy);
});
cmd.command('dev')
    .description('Build and watch in development mode.')
    .action(() => {
    cmd_1.dev();
});
cmd.command('publish')
    .description('Publish statics to CDN server, including js, css and images.')
    .option('-c, --clear', 'Clear the bucket before publish.')
    .action((options) => {
    cmd_1.publish(options && options.clear);
});
cmd.command('*')
    .action((...args) => {
    args.pop();
    lib_1.log.error(`  Error: command not found: ${args.join(' ')}`);
    cmd.outputHelp();
});
cmd.parse(process.argv);
if (!cmd.args.length) {
    cmd.outputHelp();
}
//# sourceMappingURL=index.js.map