"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Fs = require("fs-extra");
const Process = require("process");
const Moment = require("moment");
const utils_1 = require("./../../utils");
const config_1 = require("./../../config");
exports.DefaultAppConfig = {
    server: {
        port: 3333,
        views: './build/lib/server/view',
        favicon: './favicon.ico',
        static: [
            'dist',
            'node_modules'
        ]
    },
    style: {
        path: './style',
        items: {}
    },
    mock: {
        path: './mock',
        active: false
    }
};
exports.AppEnvs = {
    dev: 'development',
    pro: 'product'
};
var AppStatus;
(function (AppStatus) {
    AppStatus[AppStatus["offline"] = 1] = "offline";
    AppStatus[AppStatus["online"] = 2] = "online";
    AppStatus[AppStatus["deleted"] = 3] = "deleted";
})(AppStatus = exports.AppStatus || (exports.AppStatus = {}));
exports.ProjectTypes = {
    app: 'app',
    component: 'component',
    lib: 'lib',
    project: 'project',
    projectApp: 'project-app',
    server: 'server'
};
const DefaultServerConfig = {};
const DefaultAppInstance = {
    script: '',
    config: exports.DefaultAppConfig,
    status: AppStatus.offline,
    type: exports.ProjectTypes.project,
    desc: '',
    created_at: Moment(),
    updated_at: undefined,
    deleted_at: undefined
};
class App {
    constructor(options) {
        this.config = Object.assign({}, DefaultServerConfig, options);
    }
    static start(name) {
        const app = this.apps[name];
        utils_1.log(`start app: ${name} now in port ${app.config.server.port}`);
        if (!name || !app) {
            utils_1.log(`app: ${name} not exist!`);
            return false;
        }
        try {
            if (Fs.statSync(app.script).isFile()) {
                Process.env[name] = exports.AppEnvs.pro;
                utils_1.exeCmd([`pm2 start ${app.script}`]);
            }
        }
        catch (err) {
            utils_1.log(`start app:${name} error!`);
            return false;
        }
        return true;
    }
    static stop(name) {
        const script = Path.resolve(config_1.AppConfig.appPath, `${name}.js`);
        if (!name || !Fs.statSync(script).isFile()) {
            return utils_1.log.error(`app ${name} does not exist.`);
        }
        try {
            Fs.unlinkSync(script);
            utils_1.exeCmd([`pm2 stop ${name}`]);
            utils_1.log(`stop ${name} successfully.`);
        }
        catch (err) {
            throw new Error(`stop ${name} failed: ${err}`);
        }
    }
    static serve(name) {
        const script = Path.resolve(config_1.AppConfig.appPath, `${name}.js`);
        if (!name || !Fs.statSync(script).isFile()) {
            return utils_1.log.error(`app ${name} does not exist.`);
        }
        try {
            Process.env[name] = exports.AppEnvs.dev;
            utils_1.exeCmd([`node ${script}`]);
            utils_1.log(`start a server for app ${name} successfully.`);
        }
        catch (err) {
            throw new Error(`serve ${name} failed: ${err}`);
        }
    }
    static list(name) {
        return this.list;
    }
    static init(name, options, desc) {
        const projectType = exports.ProjectTypes[utils_1.getProjectType(Path.resolve('./'))] || '';
        let app;
        const script = Path.resolve(config_1.AppConfig.appPath, `${name}.js`);
        options = Object.assign({}, exports.DefaultAppConfig, options);
        options.server.views = exports.DefaultAppConfig.server.views;
        Fs.ensureDirSync(config_1.AppConfig.appPath);
        Fs.writeFileSync(script, utils_1.generateApp(name, projectType, options), {
            encoding: 'utf-8'
        });
        app = Object.assign({}, DefaultAppInstance, {
            name,
            script,
            type: projectType,
            desc: desc || '',
            config: options,
            created_at: Moment()
        });
        this.apps[name] = app;
    }
}
App.apps = {};
exports.App = App;
//# sourceMappingURL=app.js.map