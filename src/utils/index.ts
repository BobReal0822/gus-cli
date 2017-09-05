/**
 * utils for gus-cli
 */

import * as Path from 'path';
import * as Fs from 'fs';
import * as chalk from 'chalk';

// export const projectTypesMapping = {
//     app: 'app',
//     component: 'component',
//     project: 'project',
//     project_app: 'project-app',
//     server: 'server'
// };

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
