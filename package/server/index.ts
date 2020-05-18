import * as Path from 'path';
import * as Fs from 'fs-extra';

import { getConfig, getFiles } from './../../util';

export interface BaseServerConfigInfo {
  outDir: string;
  server: {
    port: number;
    static: string;
    view: string;
    seo?: {
      path: string;
    };
  };
}

export type WebsiteServerConfigInfo = BaseServerConfigInfo & {
  entryDir: string;
};

export type SpaServerConfigInfo = BaseServerConfigInfo & {
  entry: string;
  mock: {
    path: string;
    active: boolean;
  };
};

interface MockDataInfo {
  path: string;
  method: 'get' | 'post' | 'delete' | 'head' | 'put' | 'patch';
  data: {};
}

const DefaultServerName = 'gus-website';

/**
 * Load page and api routes for node server.
 *
 * @param {string} path
 * @returns {MockDataInfo[]}
 */
function loadRoutes(path: string): MockDataInfo[] {
  const fileRegex = /\.js$/;
  let data: MockDataInfo[] = [];

  if (Fs.pathExistsSync(path)) {
    Fs.readdirSync(path).map((file: string) => {
      const filePath = Path.resolve(path, file);
      if (file && fileRegex.test(file) && Fs.statSync(filePath).isFile()) {
        const module = require(filePath);
        const defaultData: MockDataInfo[] = (module && module.default) || [];

        if (defaultData && defaultData.length) {
          data = data.concat(defaultData);
        }
      } else if (Fs.statSync(filePath).isDirectory()) {
        data = data.concat(loadRoutes(filePath));
      }
    });
  }

  return data;
}

function loadPages(path: string): string[] {
  const data: string[] = [];

  if (Fs.pathExistsSync(path)) {
    Fs.readdirSync(path).map((file: string) => {
      const fileReg = /^(.+)\.html$/;
      const fileMatches = fileReg.exec(file);

      if (fileMatches && fileMatches[1]) {
        data.push(fileMatches[1]);
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
export class Server<T extends BaseServerConfigInfo> {
  private name: string;
  private config: T;

  /**
   * Creates an instance of Server.
   * @param {string} name
   * @param {T} config
   * @param {*} [options]
   * @memberof Server
   */
  constructor(name: string, config: T, options?: any) {
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

  static start(name: string) {
    // TODO: deploy app with pm2
  }

  static stop(name: string) {
    // TODO: stop app with pm2
  }

  /**
   * Generate node server according config.
   *
   * @private
   * @returns
   * @memberof Server
   */
  private generate() {
    const {
      config: { outDir, server }
    } = this as any;

    Fs.ensureDirSync(Path.resolve(outDir, server.view));
    const { mock, seo } = this.config as any;
    const mockRouterPath = mock && Path.resolve(mock.path);
    const mockRoutes = mock && loadRoutes(mockRouterPath);
    const seoMappings = seo?.path
      ? loadPages(Path.resolve(server.view, seo.path))
      : [];
    const seoPath = seo?.path || '';
    // const nodeEnv = process.env.NODE_ENV;

    return `
const Path = require('path');
const Fs = require('fs');
const Process = require('process');
const Koa = require('koa');
const Hbs = require('koa-hbs');
const StaticCache = require('koa-static-cache');
const mock = ${process.env.NODE_ENV === 'development' && mock && mock.active};
const manifest = require('${Path.resolve(
      outDir,
      server.static,
      './manifest.json'
    )}');
const app = new Koa();

app.use(Hbs.middleware({
  viewPath: Path.resolve(__dirname, '${server.view}'),
  extname: '.html'
}));

app.use(StaticCache(Path.resolve(__dirname, '${server.static}')));

Hbs.registerHelper('url', (target) => {
  return target in manifest ? manifest[target] : target;
});

Hbs.registerHelper('group', (target) => {
  let res = '<div>';

  Object.keys(manifest).map(item => {
    if (item.indexOf(target + '~') > -1) {
      res += '<script src="' + manifest[item] + '"></script>';
    }
  });

  return new Hbs.SafeString(res + '</div>');
});

app.use(async (ctx, next) => {
  await next();

  if (${!!(this.config && (this.config as any)).entry}) {
    let matched = false;
    let result = {};
    const userAgent = ctx.headers['user-agent'];
    const spiderUA = /Baiduspider|bingbot|Googlebot|360spider|Sogou|Yahoo! Slurp/;
    const isSpider = spiderUA.test(userAgent);
    const seoPath = '${seoPath}';

    if (isSpider) {
      let url = ctx.url || '/';
      const seoPages = ${JSON.stringify(seoMappings)};

      for (let i=0; i<seoPages.length; i++) {
        const seoPage = seoPages[i];

        if (ctx.path === '/') {
          return ctx.render(seoPath + '/index');
          break;
        } else if ('/' + seoPage === ctx.path) {
          return ctx.render(seoPath + ctx.path);
          break;
        }
      }
    } else {
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
    }
  } else {
    let url = ctx.url || '/';
    let matches = /(.+)\\/$/.exec(url);
    let matchedUrl = matches && matches[1];

    const pages = '${getFiles(Path.resolve(server.view)).map((item: any) =>
      item.path.substr(0, item.path.length - item.ext.length)
    )}'.split(',');
    pages.push('');
    url = url.slice(1, url.length);
    matchedUrl = matchedUrl && matchedUrl.slice(1, matchedUrl.length);

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
