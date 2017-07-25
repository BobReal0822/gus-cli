import * as Path from 'path';

import * as Koa from 'koa';
import * as Router from 'koa-router';
import * as Views from 'koa-views';
import * as Static from 'koa-static';
// import * as ReactView from 'koa-react-view';

// tslint:disable-next-line
const ReactView = require('koa-react-view');
// tslint:disable-next-line
const register = require('babel-register');

// import { Server } from './../config';


export interface IServerInitOptions {

}

export class Server {
    constructor(options: IServerInitOptions) {
        console.log('init');
    }

    start() {

    }

    initServer() {
        const App = new Koa();
        const router = new Router();

        // App.use(Views(__dirname + './../server/views', {
        //   extension: 'hbs',
        //   map: {
        //     hbs: 'handlebars'
        //   }
        // }));

        ReactView(App, {
            extname: 'js',
            views: Path.join(__dirname, './view')
            // internals: true
        });

        register({
            presets: [ 'es2015', 'react' ],
            extensions: [ '.js' ]
        });

        App.use(Static(Path.resolve('./dist')));
        App.use(Static(Path.resolve('./node_modules')));

        // x-response-time
        App.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
            const start: any = new Date();
            await next();
            const ms: any = new Date() as any - start;

            console.log('response: ', ms);
            ctx.set('X-Response-Time', `${ms}ms`);
        });

        // logger
        // App.use(Logger);

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

        App.use(router.routes());
        App.use(router.allowedMethods());

        App.on('error', (err: any, ctx: Koa.Context) => {
            console.error('server error: ', err, ctx);
        });

        App.listen(this.port);

        this.app = App;
    }

}

