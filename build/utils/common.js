"use strict";
/**
 * utils for gus-cli
 */
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const Fs = require("fs-extra");
const Path = require("path");
const child_process_1 = require("child_process");
const Process = require("process");
const Chokidar = require("chokidar");
const _ = require("lodash");
const packagePath = Path.join(__dirname, './../..', 'package.json');
const DefaultAppConfig = {
    server: {
        port: 3333,
        static: [
            'dist',
            'node_modules'
        ]
    },
    style: {
        path: './style',
        items: {}
    }
};
/**
 * Get package version.
 *
 * @export getVersion
 * @returns {string}
 */
function getVersion() {
    const packageInfo = JSON.parse(Fs.readFileSync(packagePath, 'utf8'));
    return packageInfo && packageInfo.version || 'invalid version!';
}
exports.getVersion = getVersion;
exports.log = (message, ...args) => console.log(message, ...args);
exports.log.error = (message, ...args) => console.log(chalk_1.default.bold.red(message), ...args);
exports.log.warning = (message, ...args) => console.log(chalk_1.default.bold.yellow(message), ...args);
function getProjectType(path) {
    const packageInfo = JSON.parse(Fs.readFileSync(Path.resolve(path, 'package.json'), 'utf8'));
    return packageInfo && packageInfo.type || '';
}
exports.getProjectType = getProjectType;
function exeCmd(cmds, noOut) {
    cmds.map(cmd => {
        const exe = child_process_1.exec(cmd);
        if (!noOut) {
            exe.stdout.pipe(Process.stdout);
            exe.on('exit', code => {
                exports.log.warning(`child process exited with code ${code.toString()}`);
            });
        }
        exe.stderr.pipe(Process.stderr);
        exe.on('error', err => {
            throw new Error(`${cmd}: ${err}`);
        });
    });
}
exports.exeCmd = exeCmd;
function getConfig(name) {
    const path = Path.resolve(name, 'config.json');
    if (!name) {
        return DefaultAppConfig;
    }
    const config = JSON.parse(Fs.readFileSync(path).toString());
    return Object.assign({}, _.cloneDeep(DefaultAppConfig), config);
}
exports.getConfig = getConfig;
function buildStyle(dir, styles, watch) {
    const exes = [];
    styles.map(style => {
        if (style && style.dist && style.source) {
            Fs.ensureFile(style.source);
            exes.push(`lessc ${style.source} > ${style.dist}`);
            if (!watch) {
                exports.log(chalk_1.default.yellow(`style built: ${Path.relative(dir, style.source)}`));
            }
        }
    });
    if (watch) {
        const watcher = Chokidar.watch(dir).on('all', (event, path) => {
            exports.log(chalk_1.default.yellow('watching style: '), chalk_1.default.gray(event), Path.relative(dir, path));
            exeCmd(exes, true);
        });
        watcher.on('error', error => exports.log.err(`Watcher error: ${error}`));
    }
    else {
        exeCmd(exes, true);
    }
}
exports.buildStyle = buildStyle;
//# sourceMappingURL=common.js.map