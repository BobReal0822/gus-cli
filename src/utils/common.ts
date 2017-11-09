/**
 * utils for gus-cli
 */

import { default as chalk } from 'chalk';
import * as Fs from 'fs';
import * as Path from 'path';
import { exec } from 'child_process';
import * as Process from 'process';

const packagePath = Path.join(__dirname, './../..', 'package.json');

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

export function exeCmd(cmd: string) {
  const exe = exec(cmd);

  exe.stdout.pipe(Process.stdout);
  exe.stderr.pipe(Process.stderr);
  exe.on('error', err => {
    throw new Error(`in exeCmd: ${ err }`);
  });
  exe.on('exit', code => {
    log.error('child process exited with code ' + code.toString());
  });
}
