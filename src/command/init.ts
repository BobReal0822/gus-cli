/**
 *
 */
import * as ChildProcess from 'child_process';
import * as Process from 'process';

import * as chalk from 'chalk';

const Exec = ChildProcess.exec;

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

export const InitNameMapping: InitNameInterface = {
    lib: {
        value: 'yo ts-lib',
        desc: ''
    },
    app: {
        value: 'yo gus-fe --color',
        desc: ''
    }
};

export function init(name: string, options?: InitOptionsInterface) {
    const command = InitNameMapping[name];

    if (!name || !command) {
        return;
    }

    console.log('chalk enable: ', chalk.enabled);

    console.log(`
        run gus init ${ chalk.yellow(name) } now:
        begin ${ chalk.yellow(command.value) }${ command.desc && chalk.gray(`(${ command.desc })`) }
    `);

    const exec = Exec(command.value);

    exec.stdout.pipe(Process.stdout);
    exec.stderr.pipe(Process.stderr);
    exec.on('exit', code => {
        console.log(chalk.red('child process exited with code ' + code.toString()));
    });
}
