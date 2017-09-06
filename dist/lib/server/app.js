"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Koa = require("koa");
const Router = require("koa-router");
const Static = require("koa-static");
const Moment = require("moment");
const utils_1 = require("./../../utils");
const ReactView = require('koa-react-view');
const register = require('babel-register');
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
const DefaultAppOptions = {
    port: 3000,
    staticPaths: [
        'dist',
        'node_modules'
    ],
    viewPath: './view'
};
const DefaultAppInstance = {
    instance: new Koa(),
    config: {
        port: 3000,
        staticPaths: ['dist'],
        viewPath: './view'
    },
    status: AppStatus.offline,
    type: exports.ProjectTypes.project,
    desc: '',
    created_at: Moment(),
    updated_at: undefined,
    deleted_at: undefined
};
class Server {
    constructor(options) {
        console.log('init');
        this.config = Object.assign({}, DefaultServerConfig, options);
    }
    static startApp(name) {
        const app = this.apps[name];
        utils_1.log(`start app: ${name} now in port ${app.config.port}: \n ${JSON.stringify(app)}`);
        if (!name || !app) {
            utils_1.log(`app: ${name} not exist!`);
            return false;
        }
        try {
            console.log('app config: ', JSON.stringify(app), JSON.stringify(app.config));
            app.instance.listen(app.config.port);
        }
        catch (err) {
            utils_1.log(`start app:${name} error!`);
            return false;
        }
        return true;
    }
    static stopApp(name) {
    }
    static deleteApp(name) {
        const app = this.apps[name];
        if (!name || !app) {
            return false;
        }
        this.stopApp(name);
        return true;
    }
    static initApp(name, options, desc) {
        const instance = new Koa();
        const router = new Router();
        const projectType = exports.ProjectTypes[utils_1.getProjectType(Path.resolve('./'))] || '';
        let app;
        utils_1.log('name & options before assign: ', name, options);
        options = Object.assign({}, DefaultAppOptions, {
            port: options.port
        });
        utils_1.log('init app options: ', options, projectType);
        utils_1.log('view path: ', Path.resolve(__dirname, options.viewPath));
        ReactView(instance, {
            extname: 'js',
            views: Path.resolve(__dirname, options.viewPath)
        });
        register({
            presets: ['es2015', 'react'],
            extensions: ['.js']
        });
        (options.staticPaths || []).map(path => {
            instance.use(Static(Path.resolve(path)));
        });
        instance.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
            const start = new Date();
            yield next();
            const ms = new Date() - start;
            ctx.set('X-Response-Time', `${ms}ms`);
        }));
        process.env.browser = 'app-server';
        router.get('*', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
            yield next();
            ctx.state = {
                app: {
                    name,
                    type: projectType
                },
                viewEngine: 'React',
                location: ctx.req.url,
                context: ctx,
                data: {
                    userId: 'b-111',
                    name: 'hahaha'
                }
            };
            return ctx.render('index');
        }));
        instance.use(router.routes());
        instance.use(router.allowedMethods());
        instance.on('error', (err, ctx) => {
            utils_1.log.error(`server error: ${err}`);
        });
        app = Object.assign({}, DefaultAppInstance, {
            instance,
            type: projectType,
            desc: desc || '',
            config: options,
            created_at: Moment()
        });
        this.apps[name] = app;
    }
}
Server.apps = {};
exports.Server = Server;
//# sourceMappingURL=app.js.map