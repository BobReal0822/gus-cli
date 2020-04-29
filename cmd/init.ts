import * as Path from 'path';
import * as Process from 'process';
import { prompt } from 'inquirer';
import { default as chalk } from 'chalk';

import { log } from './../lib';
import { exeCmd } from './../util';

export interface InitOptionsInterface {}

export interface InitNameInterface {
  [key: string]: {
    cmd: string;
    desc: string;
  };
}

export const InitTypeMapping: InitNameInterface = {
  website: {
    cmd: `yo ${Path.resolve(
      __dirname,
      './../..',
      'node_modules/generator-ws-app//generators/app/index.js'
    )}`,
    desc: 'yo ws-app'
  },
  spa: {
    cmd: `yo ${Path.resolve(
      __dirname,
      './../..',
      'node_modules/generator-spa-app//generators/app/index.js'
    )}`,
    desc: 'yo spa-app'
  }
};

/**
 * Entry for command 'init'.
 *
 * @export
 * @param {string} type
 * @param {string} name
 * @param {*} [options]
 */
export function init(type: string, name: string, options?: any) {
  if (!type) {
    selectProject();
  } else if (!name) {
    inputName(type);
  } else if (type in InitTypeMapping) {
    generate(type, name);
  } else {
    log.error(`Error, init type is invalid: ${type}`);
  }
}

/**
 * Select project type for command 'init', should be 'website' or 'spa(single page application)'.
 */
function selectProject() {
  prompt([
    {
      type: 'list',
      name: 'project',
      message: 'Please select project type:',
      default: 0,
      choices: Object.keys(InitTypeMapping)
    }
  ]).then((answer: any) => {
    inputName(answer['project'] || '');
  });
}

/**
 * Input a name for the project.
 *
 * @param {string} type
 */
function inputName(type: string) {
  if (!(type in InitTypeMapping)) {
    log.error('Command not found!');
    Process.exit(1);
  }

  prompt([
    {
      type: 'input',
      name: 'name',
      message: `Please input ${type} name:`,
      default: `gus-${type}`,
      validate: (input: string) => {
        return /^[\w\-]+$/.test(input) || 'Input format error!';
      }
    }
  ]).then((nameAnswer: any) => {
    const name = nameAnswer['name'] || '';

    if (!name) {
      return log.error(`${type} name can't be null! \n`);
    }

    generate(type, name);
  });
}

/**
 * Generate project by it's type and name.
 *
 * @param {string} type
 * @param {string} name
 * @param {InitOptionsInterface} [options]
 */
function generate(type: string, name: string, options?: InitOptionsInterface) {
  const command = InitTypeMapping[type];

  if (!type || !command) {
    log.error('Command not found!');
    Process.exit(1);
  }

  log(`
    run gus init ${type} ${chalk.yellow(name)} now:
    begin to ${chalk.yellow(command.desc)}
  `);

  exeCmd([command.cmd]);
}
