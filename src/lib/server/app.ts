import * as Path from 'path';
import * as Fs from 'fs-extra';

import * as Koa from 'koa';
import * as Static from 'koa-static';
import * as Views from 'koa-views';
import * as Moment from 'moment';
import * as _ from 'lodash';

import { getProjectType, log, generateApp, exeCmd, getConfig } from './../../utils';
import { AppConfig } from './../../config';

export interface AppOptions {
  port: number;
  static?: string[];
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

export interface AppInstance {
  script: string;
  config: AppOptions;
  status: AppStatus;
  type: string;
  desc: string;
  created_at: Moment.Moment | undefined;
  updated_at: Moment.Moment | undefined;
  deleted_at: Moment.Moment | undefined;
}

export interface ServerOptions {
}

const DefaultServerConfig: ServerOptions = {
};

const DefaultAppOptions: AppOptions = {
  port: 3000,
  static: [
    'dist',
    'node_modules'
  ],
  viewPath: './build/lib/server/view'
};

const DefaultAppInstance: AppInstance = {
  script: '',
  config: DefaultAppOptions,
  status: AppStatus.offline,
  type: ProjectTypes.project,
  desc: '',
  created_at: Moment(),
  updated_at: undefined,
  deleted_at: undefined
};

export class App {
  private config: ServerOptions;
  static apps: {
    [key: string]: AppInstance;
  } = {};

  constructor(options: ServerOptions) {
    this.config = Object.assign({}, DefaultServerConfig,  options);
  }

  static start(name: string) {
    const app = this.apps[name];

    log(`start app: ${ name } now in port ${ app.config.port }`);
    if (!name || !app) {
      log(`app: ${ name } not exist!`);

      return false;
    }

    try {
      if (app.script) {
        exeCmd([`pm2 start ${ app.script }`]);
      }
    } catch (err) {
      log(`start app:${ name } error!`);

      return false;
    }

    return true;
  }

  static stop(name: string) {
    const script = Path.resolve(AppConfig.appPath, `${ name }.js`);

    if (!name || !Fs.existsSync(script)) {
        return log.error(`app ${ name } does not exist.`);
      }

    try {
        Fs.unlinkSync(script);
        exeCmd([`pm2 stop ${ name }`]);

        log(`stop ${ name } successfully.`);
      } catch (err) {
        throw new Error(`stop ${ name } failed: ${ err }`);
      }
  }

  static list(name: string) {
    return this.list;
  }

  static init(name: string, options: AppOptions, desc?: string) {
    const projectType: string = ProjectTypes[getProjectType(Path.resolve('./'))] || '';
    let app: AppInstance;
    const script = Path.resolve(AppConfig.appPath, `${ name }.js`);

    options = Object.assign({}, DefaultAppOptions, options);
    Fs.ensureDirSync(AppConfig.appPath);
    Fs.writeFileSync(script, generateApp(name, projectType, options), {
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

