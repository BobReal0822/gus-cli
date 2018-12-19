"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Fs = require("fs-extra");
const util_1 = require("./../../util");
const DefaultServerName = 'gus-website';
/**
 * Load page and api routes for node server.
 *
 * @param {string} path
 * @returns {MockDataInfo[]}
 */
function loadRoutes(path) {
    const fileRegex = /\.js$/;
    let data = [];
    if (Fs.pathExistsSync(path)) {
        Fs.readdirSync(path).map((file) => {
            const filePath = Path.resolve(path, file);
            if (file && fileRegex.test(file) && Fs.statSync(filePath).isFile()) {
                const module = require(filePath);
                const defaultData = module && module.default || [];
                if (defaultData && defaultData.length) {
                    data = data.concat(defaultData);
                }
            }
            else if (Fs.statSync(filePath).isDirectory()) {
                data = data.concat(loadRoutes(filePath));
            }
        });
    }
    return data;
}
/**
 * Operate node server.
 *
 * @export
 * @class Server
 * @template T
 */
class Server {
    /**
     * Creates an instance of Server.
     * @param {string} name
     * @param {T} config
     * @param {*} [options]
     * @memberof Server
     */
    constructor(name, config, options) {
        this.name = name || DefaultServerName;
        this.config = config;
    }
    /**
     * Init node server by generating 'server.js'
     *
     * @returns
     * @memberof Server
     */
    init() {
        const { outDir } = this.config;
        const serverPath = Path.resolve(outDir, 'server.js');
        Fs.ensureDirSync(Path.resolve(outDir));
        Fs.writeFileSync(serverPath, this.generate(), {
            encoding: 'utf-8'
        });
        return this;
    }
    static start(name) {
        // TODO: deploy app with pm2
    }
    static stop(name) {
        // TODO: stop app with pm2
    }
    /**
     * Generate node server according config.
     *
     * @private
     * @returns
     * @memberof Server
     */
    generate() {
        const { config: { outDir, server } } = this;
        Fs.ensureDirSync(Path.resolve(outDir, server.view));
        const { mock } = this.config;
        const mockRouterPath = mock && Path.resolve(mock.path);
        const mockRoutes = mock && loadRoutes(mockRouterPath);
        // const nodeEnv = process.env.NODE_ENV;
        return `
const Path = require('path');
const Fs = require('fs');
const Process = require('process');
const Koa = require('koa');
const Hbs = require('koa-hbs');
const StaticCache = require('koa-static-cache');
const mock = ${process.env.NODE_ENV === 'development' && mock && mock.active};
const manifest = require('${Path.resolve(outDir, server.static, './manifest.json')}');
const app = new Koa();

app.use(Hbs.middleware({
  viewPath: Path.resolve(__dirname, '${server.view}'),
  extname: '.html'
}));

app.use(StaticCache(Path.resolve(__dirname, '${server.static}')));

Hbs.registerHelper('url', (target) => {
  return target in manifest ? manifest[target] : target;
});

app.use(async (ctx, next) => {
  await next();

  if (${!!(this.config && this.config).entry}) {
    let matched = false;
    let result = {};

    if (mock) {
      ${JSON.stringify(mockRoutes || [])}.map(route => {
        if (route && !matched && (ctx.request.method).toLowerCase() === (route.method || '').toLowerCase() && ctx.request.path === route.path) {
          matched = true;
          result = route.result || {};
        }
      })
    }

    if (!matched) {
      return ctx.render('index', {});
    } else {
      return ctx.body = result;
    }
  } else {
    let url = ctx.url || '/';
    let matches = /(.+)\\/$/.exec(url);
    let matchedUrl = matches && matches[1];

    const pages = '${util_1.getFiles(Path.resolve(server.view)).map(item => item.path.substr(0, item.path.length - item.ext.length))}'.split(',');
    pages.push('');
    url = url.slice(1, url.length);
    matchedUrl = matchedUrl && matchedUrl.slice(1, matchedUrl.length);

    console.log('get request: ', url, matchedUrl);

    if (pages.indexOf(url) > -1) {
      return ctx.render(!url ? 'index' : url, {});
    } else if (pages.indexOf(matchedUrl) > -1) {
      return ctx.render(!matchedUrl ? 'index' : matchedUrl, {});
    } else {
      return ctx.render('404');
    }
  }
});

app.on('error', (err, ctx) => {
  if (err.code === "EPIPE" || err.code === "ECONNRESET") {
    // process.exit(0);
    console.log('Warning eror: ', err.code);
  } else {
    throw new Error(err);
  }
});

app.listen(${server.port});
    `;
    }
}
exports.Server = Server;
//# sourceMappingURL=index.js.map