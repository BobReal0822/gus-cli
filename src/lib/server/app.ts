import * as Path from 'path';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Views from 'koa-views';
import * as Static from 'koa-static';
import * as Moment from 'moment';
import { StaticRouter } from 'react-router';
import * as _ from 'lodash';

import { log, getProjectType } from './../../utils';

// import * as ReactView from 'koa-react-view';

// tslint:disable-next-line
const ReactView = require('koa-react-view');
// tslint:disable-next-line
const register = require('babel-register');

// import { Server } from './../config';

export interface IAppOptions {
    port: number;
    staticPaths?: string[];
    viewPath?: string;
    desc?: string;
}

export enum AppStatus {
    offline = 1,
    online,
    deleted
}

export const ProjectTypes: {
    [key: string]: string;
} =  {
    app: 'app',
    component: 'component',
    lib: 'lib',
    project: 'project',
    projectApp: 'project-app',
    server: 'server'
};

export interface IAppInstance {
    instance: Koa;
    config: IAppOptions;
    status: AppStatus;
    type: string;
    desc: string;
    created_at: Moment.Moment | undefined;
    updated_at: Moment.Moment | undefined;
    deleted_at: Moment.Moment | undefined;
}

export interface IServerOptions {

}

const DefaultServerConfig: IServerOptions = {

};

const DefaultAppOptions: IAppOptions = {
    port: 3000,
    staticPaths: [
        'dist',
        'node_modules'
    ],
    viewPath: './view'
};

const DefaultAppInstance: IAppInstance = {
    instance: new Koa(),
    config: {
        port: 3000,
        staticPaths: ['dist'],
        viewPath: './view'
    },
    status: AppStatus.offline,
    type: ProjectTypes.project,
    desc: '',
    created_at: Moment(),
    updated_at: undefined,
    deleted_at: undefined
};

export class Server {
    private config: IServerOptions;
    static apps: {
        [key: string]: IAppInstance;
    } = {};

    constructor(options: IServerOptions) {
        console.log('init');
        this.config = Object.assign({}, DefaultServerConfig, options);
    }

    static startApp(name: string) {
        // TODO: is port available
        const app = this.apps[name];

        log(`start app: ${ name } now in port ${ app.config.port }: \n ${ JSON.stringify(app) }`);
        if (!name || !app) {
            log(`app: ${ name } not exist!`);

            return false;
        }

        try {
            console.log('app config: ', JSON.stringify(app), JSON.stringify(app.config));
            app.instance.listen(app.config.port);
        } catch (err) {
            log(`start app:${ name } error!`);

            return false;
        }

        return true;
    }

    static stopApp (name: string) {
        //
    }

    static deleteApp(name: string): boolean {
        const app = this.apps[name];

        if (!name || !app) {
            return false;
        }

        this.stopApp(name);

        return true;
    }

    static initApp(name: string, options: IAppOptions, desc?: string) {
        const instance = new Koa();
        const router = new Router();
        const projectType: string = ProjectTypes[getProjectType(Path.resolve('./'))] || '';
        let app: IAppInstance;

        log('name & options before assign: ', name, options);
        options = Object.assign({}, DefaultAppOptions, {
            port: options.port
        });

        log('init app options: ', options, projectType);
        log('view path: ', Path.resolve(__dirname, options.viewPath));
        ReactView(instance, {
            extname: 'js',
            views: Path.resolve(__dirname, options.viewPath)
            // internals: true
        });

        register({
            presets: [ 'es2015', 'react' ],
            extensions: [ '.js' ]
        });

        (options.staticPaths || []).map(path => {
            instance.use(Static(Path.resolve(path)));
        });

        instance.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
            const start: any = new Date();
            await next();
            const ms: any = new Date() as any - start;

            ctx.set('X-Response-Time', `${ms}ms`);
        });

        process.env.browser = 'app-server';
        router.get('*', async (ctx: Koa.Context, next: any) => {
            await next();

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
        });

        instance.use(router.routes());
        instance.use(router.allowedMethods());

        instance.on('error', (err: any, ctx: Koa.Context) => {
            log.error(`server error: ${ err }`);
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

