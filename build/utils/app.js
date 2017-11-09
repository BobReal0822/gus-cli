"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function generateApp(name, type, options) {
    console.log('options in generatApp: ', name, type, options);
    return `
    const Path = require('path');
    const Koa = require('koa');
    const Static = require('koa-static');
    const ReactView = require('koa-react-view');
    const register = require('babel-register');

    const app = new Koa();

    ReactView(app, {
      extname: 'js',
      views: Path.resolve(__dirname, './../../', '${options.viewPath}')
    });

    register({
      presets: [ 'es2015', 'react' ],
      extensions: [ '.js' ]
    });

    [${(options.static || []).map(item => `'${item}'`)}].map(path => {
      if (path) {
        app.use(Static(Path.resolve(path)));
        app.use(Static(Path.resolve(path, '${name}')));
      }
    });

    process.env.browser = 'app-server';
    app.use(async (ctx, next) => {
      const url = ctx.url || '/';

      await next();
      ctx.state = {
        app: {
          name: '${name}',
          type: '${type}'
        },
        viewEngine: 'React',
        location: url,
        context: ctx,
        data: {
          location: url
        }
      };

      return ctx.render('index');
    });

    app.on('error', (err, ctx) => {
      throw new Error(err)
    });

    app.listen(${options.port});
  `;
}
exports.generateApp = generateApp;
//# sourceMappingURL=app.js.map