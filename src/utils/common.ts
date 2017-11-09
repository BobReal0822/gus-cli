/**
 * utils for gus-cli
 */

import { default as chalk } from 'chalk';
import * as Fs from 'fs-extra';
import * as Path from 'path';
import { exec } from 'child_process';
import * as Process from 'process';
import * as Chokidar from 'chokidar';
import * as Less from 'less';
import { EventEmitter } from 'events';

import * as _ from 'lodash';

const packagePath = Path.join(__dirname, './../..', 'package.json');

export interface AppConfigInfo {
  server: {
    port: number;
    static: string[];
  };
  style: {
    path: string;
    items: {
      [key: string]: string;
    }
  };
}

const DefaultAppConfig: AppConfigInfo = {
  server: {
    port: 3333,
    static: [
      'dist',
      'node_modules'
    ]
  },
  style: {
    path: './style',
    items: {}
  }
};

/**
 * Get package version.
 *
 * @export getVersion
 * @returns {string}
 */
export function getVersion(): string {
  const packageInfo = JSON.parse(Fs.readFileSync(packagePath, 'utf8'));

  return packageInfo && packageInfo.version || 'invalid version!';
}

export const log: any = (message: string, ...args: any[]): void => console.log(message, ...args);
log.error = (message: string, ...args: any[]): void => console.log(chalk.bold.red(message), ...args);
log.warning = (message: string, ...args: any[]): void => console.log(chalk.bold.yellow(message), ...args);

export function getProjectType(path: string): string {
  const packageInfo = JSON.parse(Fs.readFileSync(Path.resolve(path, 'package.json'), 'utf8'));

  return packageInfo && packageInfo.type || '';
}

export function exeCmd(cmds: string[], noOut?: boolean) {

  cmds.map(cmd => {
    const exe = exec(cmd);

    if (!noOut) {
      exe.stdout.pipe(Process.stdout);
      exe.on('exit', code => {
        log.warning(`child process exited with code ${ code.toString() }`);
      });
    }
    exe.stderr.pipe(Process.stderr);
    exe.on('error', err => {
      throw new Error(`${ cmd }: ${ err }`);
    });
  });
}

export function getConfig(name: string): AppConfigInfo {
  const path = Path.resolve(name, 'config.json');

  if (!name) {
    return DefaultAppConfig;
  }

  const config = JSON.parse(Fs.readFileSync(path).toString());

  return Object.assign({}, _.cloneDeep(DefaultAppConfig), config);
}

export function buildStyle(dir: string, styles: { source: string; dist: string }[], watch?: boolean) {
  const exes: string[] = [];
  styles.map(style => {
    if (style && style.dist && style.source) {
      Fs.ensureFile(style.source);
      exes.push(`lessc ${ style.source } > ${ style.dist }`);

      if (!watch) {
        log(chalk.yellow(`style built: ${ Path.relative(dir, style.source) }`));
      }
    }
  });

  if (watch) {
    const watcher = Chokidar.watch(dir).on('all', (event, path) => {
      log(chalk.yellow('watching style: '), chalk.gray(event), Path.relative(dir, path));
      exeCmd(exes, true);
    });

    watcher.on('error', error => log.err(`Watcher error: ${ error }`));
  } else {
    exeCmd(exes, true);
  }
}
