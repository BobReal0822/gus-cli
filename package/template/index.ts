import * as Path from 'path';
import * as Fs from 'fs-extra';

import { default as chalk } from 'chalk';

import { log } from './../../lib';
import { WebsiteServerConfigInfo, SpaServerConfigInfo  } from './../../package';
import { websitePageGenerator  } from './website.page';
import { spaPageGenerator } from './spa.page';

/**
 * Generate templates for command 'add'.
 *
 * @export
 * @param {string} path
 * @param {string} name
 * @param {WebsiteServerConfigInfo} config
 */
export function generateWebsitePage(path: string, name: string, config: WebsiteServerConfigInfo) {
  const pathArray = path && path.match(/\w+/g) || [];
  const pathMap: {
    [key: string]: string;
  } = {
    html: Path.resolve(config.server.view),
    jsx: Path.resolve(config.entryDir),
    scss: Path.resolve(config.entryDir, './../style')
  };

  pathArray.push(name);

  Object.keys(pathMap).map((ext: string) => {
    const targetDir = Path.resolve(pathMap[ext], path);
    const targetPath = Path.resolve(pathMap[ext], path, `${ name }.${ ext }`);

    Fs.ensureDirSync(targetDir);
    Fs.writeFileSync(targetPath, websitePageGenerator(pathArray.join('/'), ext));

    log(`    ${ chalk.yellow(ext) } generate successfully: ${ chalk.blue(Path.relative(Path.resolve('./'), targetPath)) }`);
  });

  log(`Add page ${ name } finished.`);
}

/**
 * Generate templates for command 'add'.
 *
 * @export
 * @param {string} path
 * @param {string} name
 * @param {WebsiteServerConfigInfo} config
 */
export function generateSpaPage(path: string, name: string, config: SpaServerConfigInfo) {
  const pathArray = path && path.match(/^[\w\_\-]+$/g) || [];
  const pathMap: {
    [key: string]: string;
  } = {
    tsx: Path.resolve(config.entry, './../page'),
    less: Path.resolve(config.entry, './../style')
  };

  pathArray.push(name);
  Object.keys(pathMap).map((ext: string) => {
    const targetDir = Path.resolve(pathMap[ext], path);
    const targetPath = Path.resolve(pathMap[ext], path, `${ name }.${ ext }`);

    Fs.ensureDirSync(targetDir);
    Fs.writeFileSync(targetPath, spaPageGenerator(pathArray.join('/'), ext));

    log(`    ${ chalk.yellow(ext) } generate successfully: ${ chalk.blue(Path.relative(Path.resolve('./'), targetPath)) }`);
  });

  log(`Add page finished.`);
}
