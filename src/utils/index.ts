/**
 * utils for gus-cli
 */

import * as Path from 'path';
import * as Fs from 'fs';

const packagePath = Path.join(__dirname, './../..', 'package.json');

/**
 * Get package version.
 * 
 * @export getVersion
 * @returns {string} 
 */
export function getVersion(): string {
  let packageInfo = JSON.parse(Fs.readFileSync(packagePath, 'utf8'));

  return packageInfo && packageInfo.version || 'unvalid version';
}