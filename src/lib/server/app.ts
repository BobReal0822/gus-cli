import * as Path from 'path';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Views from 'koa-views';
import * as Static from 'koa-static';
import * as Moment from 'moment';
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

export enum AppTypes {
    fe = 1
}

export interface IAppInstance {
    instance: Koa;
    config: IAppOptions;
    status: AppStatus;
    type: AppTypes;
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
    type: AppTypes.fe,
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

        console.log(`start app: ${ name } now in port ${ app.config.port }: \n ${ JSON.stringify(app) }`);
        if (!name || !app) {
            console.log(`app: ${ name } not exist!`);

            return false;
        }

        try {
            // app.instance.listen(app.config.port);
        } catch (err) {
            console.log(`start app:${ name } error!`);

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

    static initApp(name: string, options: IAppOptions = DefaultAppOptions, desc?: string) {
        const instance = new Koa();
        const router = new Router();
        let app: IAppInstance;

        options = Object.assign({}, DefaultAppOptions, {
            port: options.port
        });

        console.log(`\n---init app: ${ name } now with options: ${ JSON.stringify(options) }`);
        console.log(`\n--- view path: ${ Path.resolve(__dirname, options.viewPath) }`);
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
            console.log(`\n---static path: ${ Path.resolve(path) }`);
            instance.use(Static(Path.resolve(path)));
        });

        instance.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
            const start: any = new Date();
            await next();
            const ms: any = new Date() as any - start;

            ctx.set('X-Response-Time', `${ms}ms`);
        });

        router.get('/', async (ctx: Koa.Context, next: any) => {
            await next();

            ctx.state = {
                title: 'Awesome app',
                viewEngine: 'React',
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
            console.error('server error: ', err, ctx);
        });

        app = Object.assign({}, DefaultAppInstance, {
            app: instance,
            desc: desc || '',
            config: options,
            created_at: Moment()
        });

        instance.listen(options.port);
        this.apps[name] = app;
    }

}

