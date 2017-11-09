/**
 *
 */
import * as Path from 'path';
import * as Process from 'process';
import { Answers, prompt, Question } from 'inquirer';
import { default as chalk } from 'chalk';

import { getProjectType, log, exeCmd } from './../utils';

export interface InitOptionsInterface {

}

export interface InitNameInterface {
    [key: string]: {
        value: string;
        desc: string;
    };
}

export const  DefaultInitOptions: InitOptionsInterface = {

};

export const InitTypeMapping: InitNameInterface = {
    component: {
        value: 'yo gus-component',
        desc: ''
    },
    app: {
        value: 'yo gus-app --color',
        desc: ''
    },
    project: {
        value: 'yo gus-project',
        desc: ''
    },
    server: {
        value: 'yo gus-server',
        desc: ''
    },
    lib: {
        value: 'yo ts-lib',
        desc: ''
    }
};
const InitData = {
  types: [
    'component',
    'app',
    'project'
  ]
};

const error = chalk.bold.red;
const warning = chalk.bold.yellow;

export function init(type: string, name: string, options?: any) {
  if (!type) {
    selectType();
  } else if (!name) {
    selectName(type);
  } else if (InitData.types.indexOf(type) > -1) {
    console.log('should generate now: ', type, name);
    generate(type, name);
  } else {
    log.error(`Error, init type is invalid: ${ type }`);
  }
}

function selectType() {
  prompt([{
    type: 'list',
    name: 'initType',
    message: 'Select a type to init:',
    default: 0,
    choices: InitData.types
  }]).then(typeAnwser => {
    const initType = typeAnwser['initType'] || '';

    if (!initType || InitData.types.indexOf(initType) < 0) {
      return log.error(`init type can't be null!`);
    }

    selectName(initType);
  });
}

function selectName(type: string) {
  prompt([{
    type: 'input',
    name: 'initName',
    message: `Input ${ type === 'app' ? 'an' : 'a' } ${ type } name to init:`,
    default: `gus-${ type }`
  }]).then(nameAnwser => {
    const initName = nameAnwser['initName'] || '';

    if (!initName) {
      return log.error(`init name can't be null! \n`);
    }

    generate(type, initName);
  });
}

function generate(type: string, name: string, options?: InitOptionsInterface) {
    const command = InitTypeMapping[type];
    const projectType = getProjectType(Path.resolve(__dirname, './../..'));

    log('_____this project type: ', projectType);

    if (!type || !command) {
        return log.error('command not found!');
    }

    log('chalk enable: ', chalk.enabled);
    log(`
        run gus init ${ chalk.yellow(type) } now:
        begin ${ chalk.yellow(command.value) }${ command.desc && chalk.gray(`(${ command.desc })`) }
    `);

    exeCmd(projectType === 'gus-project' && type === 'app' ? 'yo gus-project-app' : command.value);
}
