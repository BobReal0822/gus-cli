"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const process_1 = require("process");
const lib_1 = require("./../lib");
const util_1 = require("./../util");
const package_1 = require("./../package");
exports.AppTypes = {
    website: 'website',
    spa: 'spa'
};
exports.DefaultWebsiteServerConfig = {
    outDir: './dist',
    entryDir: './src/component/page',
    server: {
        port: 3000,
        static: './static',
        view: './view'
    }
};
exports.DefaultSpaServerConfig = {
    outDir: './dist',
    entry: './src/index.tsx',
    server: {
        port: 4000,
        static: 'static',
        view: 'view'
    },
    mock: {
        path: './mock',
        active: false
    }
};
/**
 * Build website, generate node server, webpack config and static files.
 *
 * @param {string} name
 * @param {string} type
 * @param {boolean} dev
 * @param {boolean} [watch]
 */
function buildWebsite(name, type, dev, watch) {
    const config = util_1.getConfig(Path.resolve('./config.json'), exports.DefaultWebsiteServerConfig);
    const app = new package_1.Server(name, config).init();
    const { server, outDir, entryDir } = config;
    const serverPath = Path.resolve(outDir, 'server.js');
    const entry = {};
    util_1.getFiles(Path.resolve(entryDir)).map((file) => {
        if (file && file.name) {
            entry[file.path.substr(0, file.path.length - file.ext.length)] = Path.resolve(entryDir, file.path);
        }
    });
    const configFile = package_1.webpackConfigGenerator({
        dev,
        entry,
        viewDir: server.view,
        distDir: outDir,
        staticDir: server.static
    }, outDir, true);
    if (!name || !type) {
        lib_1.log('Not a gus project.');
        process_1.exit(1);
    }
    util_1.exeCmd([
        `${dev ? 'webpack-dev-server --hot' : 'webpack'}  --config ${configFile} ${watch ? '--watch' : ''} --mode ${dev ? 'development' : 'production'}`
    ]);
}
/**
 * Build SPA, generate node server, webpack config and static files.
 *
 * @param {string} name
 * @param {string} type
 * @param {boolean} dev
 * @param {boolean} [watch]
 * @param {boolean} preDeploy
 */
function buildSpa(name, type, dev, watch, preDeploy) {
    const config = util_1.getConfig(Path.resolve('./config.json'), exports.DefaultSpaServerConfig);
    const app = new package_1.Server(name, config).init();
    const { server, outDir, entry } = config;
    const serverPath = Path.resolve(outDir, 'server.js');
    const configFile = package_1.webpackConfigGenerator({
        dev,
        preDeploy,
        entry: {
            index: Path.resolve(entry)
        },
        viewDir: server.view,
        distDir: outDir,
        staticDir: server.static
    }, outDir);
    if (!name || !type) {
        lib_1.log('Not a gus project.');
        process_1.exit(1);
    }
    util_1.exeCmd([
        `${dev ? 'webpack-dev-server --hot' : 'webpack'}  --config ${configFile} ${watch ? '--watch' : ''} --mode ${dev ? 'development' : 'production'}`
    ]);
}
/**
 * Entry for command 'build'
 *
 * @export
 * @param {boolean} [dev=false]
 * @param {boolean} [watch]
 *
 * @const {string} [env = 'development' | 'production' | 'no-login']
 */
function build(dev = false, watch, preDeploy) {
    const { name, type } = util_1.getProjectInfo(Path.resolve('./'));
    process.env.NODE_ENV = dev ? 'development' : preDeploy ? 'pre-deploy' : 'production';
    switch (type) {
        case exports.AppTypes.website:
            buildWebsite(name, type, dev, watch);
            break;
        case exports.AppTypes.spa:
            buildSpa(name, type, dev, watch, preDeploy);
            break;
        default:
            throw new Error('Invalid app type.');
    }
}
exports.build = build;
//# sourceMappingURL=build.js.map