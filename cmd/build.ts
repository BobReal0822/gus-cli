import * as Path from 'path';
import { exit } from 'process';

import { log } from './../lib';
import {
  getProjectInfo,
  exeCmd,
  getFiles,
  getConfig,
  FileInfo
} from './../util';
import {
  Server,
  webpackConfigGenerator,
  WebsiteServerConfigInfo,
  SpaServerConfigInfo
} from './../package';

export const AppTypes = {
  website: 'website',
  spa: 'spa'
};

export const DefaultWebsiteServerConfig: WebsiteServerConfigInfo = {
  outDir: './dist',
  entryDir: './src/component/page',
  server: {
    port: 3000,
    static: './static',
    view: './view'
  }
};

export const DefaultSpaServerConfig: SpaServerConfigInfo = {
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
function buildWebsite(
  name: string,
  type: string,
  dev: boolean,
  watch?: boolean
) {
  const config = getConfig<WebsiteServerConfigInfo>(
    Path.resolve('./config.json'),
    DefaultWebsiteServerConfig
  );
  const app = new Server<WebsiteServerConfigInfo>(name, config).init();
  const { server, outDir, entryDir } = config;
  const serverPath = Path.resolve(outDir, 'server.js');

  const entry: {
    [key: string]: string;
  } = {};

  getFiles(Path.resolve(entryDir)).map((file: FileInfo) => {
    if (file && file.name) {
      entry[
        file.path.substr(0, file.path.length - file.ext.length)
      ] = Path.resolve(entryDir, file.path);
    }
  });

  const configFile = webpackConfigGenerator(
    {
      dev,
      entry,
      viewDir: server.view,
      distDir: outDir,
      staticDir: server.static
    },
    outDir,
    false
  );

  if (!name || !type) {
    log('Not a gus project.');
    exit(1);
  }

  exeCmd([
    `${dev ? 'webpack-dev-server --hot' : 'webpack'}  --config ${configFile} ${
      watch ? '--watch' : ''
    } --mode ${dev ? 'development' : 'production'}`
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
function buildSpa(
  name: string,
  type: string,
  dev: boolean,
  watch?: boolean,
  preDeploy?: boolean
) {
  const config = getConfig<SpaServerConfigInfo>(
    Path.resolve('./config.json'),
    DefaultSpaServerConfig
  );
  const app = new Server<SpaServerConfigInfo>(name, config).init();
  const { server, outDir, entry } = config;
  const serverPath = Path.resolve(outDir, 'server.js');

  const configFile = webpackConfigGenerator(
    {
      dev,
      preDeploy,
      entry: {
        index: Path.resolve(entry)
      },
      viewDir: server.view,
      distDir: outDir,
      staticDir: server.static
    },
    outDir
  );

  if (!name || !type) {
    log('Not a gus project.');
    exit(1);
  }

  exeCmd([
    `${dev ? 'webpack-dev-server --hot' : 'webpack'}  --config ${configFile} ${
      watch ? '--watch' : ''
    } --mode ${dev ? 'development' : 'production'} --inline=false`
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
export function build(dev = false, watch?: boolean, preDeploy?: boolean) {
  const { name, type } = getProjectInfo(Path.resolve('./'));

  process.env.NODE_ENV = dev
    ? 'development'
    : preDeploy
    ? 'pre-deploy'
    : 'production';

  switch (type) {
    case AppTypes.website:
      buildWebsite(name, type, dev, watch);
      break;
    case AppTypes.spa:
      buildSpa(name, type, dev, watch, preDeploy);
      break;
    default:
      throw new Error('Invalid app type.');
  }
}
