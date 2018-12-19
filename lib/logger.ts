import { default as chalk } from 'chalk';

// tslint:disable-next-line
export const log: any = (message: string, ...args: any[]): void => console.log(message, ...args);

// tslint:disable-next-line
log.error = (message: string, ...args: any[]): void => console.log(chalk.bold.red(message), ...args);

// tslint:disable-next-line
log.warning = (message: string, ...args: any[]): void => console.log(chalk.bold.yellow(message), ...args);
