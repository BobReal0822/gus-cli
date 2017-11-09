import * as Path from 'path';
import * as Fs from 'fs-extra';
import { exec } from 'child_process';

import * as Koa from 'koa';
import * as Static from 'koa-static';
import * as Views from 'koa-views';
import * as Moment from 'moment';
import * as _ from 'lodash';

import { getProjectType, log, generateApp } from './../../utils';
import { AppConfig } from './../../config';

// tslint:disable-next-line
const ReactView = require('koa-react-view');
// tslint:disable-next-line
const register = require('babel-register');

// import { Server } from './../config';

export interface AppOptions {
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
  staticPaths: [
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
    console.log('init');
    this.config = Object.assign({}, DefaultServerConfig, options);
  }

  static start(name: string) {
    const app = this.apps[name];

    log(`start app: ${ name } now in port ${ app.config.port }`);
    if (!name || !app) {
      log(`app: ${ name } not exist!`);

      return false;
    }

    try {
      console.log('should start app ', app.script);
      if (app.script) {
        exec(`pm2 start ${ app.script }`);
      }
    } catch (err) {
      log(`start app:${ name } error!`);

      return false;
    }

    return true;
  }

  static stopApp(name: string) {
    //
  }

  static list(name: string) {
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

