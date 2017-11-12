import * as Path from 'path';
import * as Fse from 'fs-extra';
import { AppConfigInfo, AppEnvs } from './../lib/server/app';

interface MockDataInfo {
  path: string;
  data: {};
}

function loadRoutes(path: string): MockDataInfo[] {
  const fileRegex = /\.js$/;
  let data: MockDataInfo[] = [];

  if (Fse.pathExistsSync(path)) {

    Fse.readdirSync(path).map(file => {
      if (file && fileRegex.test(file)) {
        const filePath = Path.resolve(path, file);
        if (Fse.statSync(filePath).isFile()) {
          // tslint:disable-next-line
          const module = require(filePath);
          const defaultData: MockDataInfo[] = module && module.default || [];

          if (defaultData && defaultData.length) {
            data = data.concat(defaultData);
          }
        } else if (Fse.statSync(filePath).isDirectory()) {
          data = data.concat(loadRoutes(filePath));
        }
      }
    });
  }

  return data;
}

export function generateApp(name: string, type: string, options: AppConfigInfo) {
  const mockRouterPath = Path.resolve('dist', name, options.mock.path);
  const mockRoutes = loadRoutes(mockRouterPath);

  return `
    const Path = require('path');
    const Koa = require('koa');
    const Static = require('koa-static');
    const ReactView = require('koa-react-view');
    const register = require('babel-register');

    const app = new Koa();

    ReactView(app, {
      extname: 'js',
      views: Path.resolve(__dirname, './../../', '${ options.server.views }')
    });

    register({
      presets: [ 'es2015', 'react' ],
      extensions: [ '.js' ]
    });

    [${ (options.server.static || []).map(item => `'${ item }'`) }].map(path => {
      if (path) {
        app.use(Static(Path.resolve(path)));
        app.use(Static(Path.resolve(path, '${ name }')));
      }
    });

    process.env.browser = 'app-server';
    app.use(async (ctx, next) => {

      await next();
      const url = ctx.url || '/';
      const mock = process.env['${ name }'] === '${ AppEnvs.dev }' && ${ options.mock.active };
      let matched = false;
      let data = {};

      if (url === '/favicon.ico') {
        return ctx.redirect('${ options.server.favicon }');
      }

      if (mock) {
        ${ JSON.stringify(mockRoutes || []) }.map(route => {
          if (!matched && (ctx.request.method).toLowerCase() === (route.method || '').toLowerCase() && ctx.request.path === route.path) {
            matched = true;
            data = route.data || {};
          }
        })
      }

      if (!matched) {
        ctx.state = {
          app: {
            name: '${ name }',
            type: '${ type }'
          },
          viewEngine: 'React',
          location: url,
          context: ctx,
          data: {
            location: url
          }
        };

        return ctx.render('index');
      } else {
        return ctx.body = data;
      }
    });

    app.on('error', (err, ctx) => {
      throw new Error(err)
    });

    app.listen(${ options.server.port });
  `;
}
