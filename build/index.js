"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const process = require("process");
const commander = require("commander");
const command_1 = require("./command");
const utils_1 = require("./utils");
commander.version(utils_1.getVersion());
commander.command('init <name>')
    .description('init a project, which should be [lib | koa | express].')
    .option("-s, --setup_mode [mode]", "Which setup mode to use")
    .action((name, options) => {
    command_1.init(name);
});
commander.command('test <dir> [otherDirs...]')
    .action((dir, otherDirs) => {
    console.log('rmdir %s', dir);
});
commander.parse(process.argv);
//# sourceMappingURL=index.js.map