/**
 *
 */
import { ChildProcess, exec } from 'child_process';
import * as Path from 'path';
import * as Process from 'process';
import { getProjectType, log } from './../utils';

import { default as chalk } from 'chalk';

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
const error = chalk.bold.red;
const warning = chalk.bold.yellow;

export function init(type: string, name: string, options?: InitOptionsInterface) {
    const command = InitTypeMapping[type];
    const projectType = getProjectType(Path.resolve(__dirname, './../..'));
    let exe: ChildProcess;

    log('_____this project type: ', projectType);

    if (!type || !command) {
        return log.error('command not found!');
    }

    log('chalk enable: ', chalk.enabled);

    log(`
        run gus init ${ chalk.yellow(type) } now:
        begin ${ chalk.yellow(command.value) }${ command.desc && chalk.gray(`(${ command.desc })`) }
    `);


    exe = exec(projectType === 'gus-project' && type === 'app' ? 'yo gus-project-app' : command.value);
    exe.stdout.pipe(Process.stdout);
    exe.stderr.pipe(Process.stderr);
    exe.on('exit', code => {
        log.error('child process exited with code ' + code.toString());
    });
}
