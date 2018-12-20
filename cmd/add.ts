
import * as Path from 'path';
import * as Process from 'process';
import { prompt } from 'inquirer';

import { log } from './../lib';
import { exeCmd, getProjectInfo, getConfig } from './../util';
import { generateWebsitePage, generateSpaPage, WebsiteServerConfigInfo, SpaServerConfigInfo } from './../package';
import { DefaultWebsiteServerConfig } from './build';

const projectType = getProjectInfo(Path.resolve('./')).type || '';
const config = getConfig<WebsiteServerConfigInfo | SpaServerConfigInfo>(Path.resolve('./config.json'), DefaultWebsiteServerConfig);
const pathValidate = /^[\w\-\/\.]+$/;
const nameValidate = /^[\w\-]+$/;
const cmdMapping: {
  [key: string]: Function;
} = {
  website: generateWebsitePage,
  spa: generateSpaPage
};

/**
 * Entry for command 'add'.
 *
 * @export
 * @param {string} type
 * @param {string} path
 * @param {string} name
 */
export function add(path: string, name: string) {
  if (!projectType || !(projectType in cmdMapping)) {
    log.error('Not a gus project!');
    Process.exit(1);
  }

  if (!path) {
    inputPath();
  } else if (!name) {
    inputName(path);
  } else {
    if (!pathValidate.test(path)) {
      log.warning('Path input format error!');
      inputPath();
    } else if (!nameValidate.test(name)) {
      log.warning('Name input format error!');
      inputName(path);
    } else {
      addModule(path, name);
    }
  }
}

/**
 * Input path for module.
 */
function inputPath() {
  prompt([{
    type: 'input',
    name: 'path',
    message: 'Please input path:',
    default: `${ projectType }-page`,
    validate: (input: string) => {
      return pathValidate.test(input) || 'Path input format error!';
    }
  }]).then((answer: {
    [key: string]: string;
  }) => {
    inputName(answer['path'] || '');
  });
}

/**
 * Input name for module.
 *
 * @param {string} path
 */
function inputName(path: string) {
  prompt([{
    type: 'input',
    name: 'name',
    message: 'Please input name:',
    default: `${ projectType }-page`,
    validate: (input: string) => {
      return nameValidate.test(input) || 'Name input format error!';
    }
  }]).then((answer: {
    [key: string]: string;
  }) => {
    const name = answer['name'] || '';
    addModule(path, name);
  });
}

/**
 * Add module by type, path & name.
 *
 * @param {string} type
 * @param {string} path
 * @param {string} name
 */
function addModule(path: string, name: string) {
  const func = cmdMapping[projectType];

  if (!func) {
    log.error('Command not exist!');
    Process.exit(1);
  }

  func(path, name, config);
}
