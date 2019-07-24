import * as Path from 'path';
import * as _ from 'lodash';
import * as globby from 'globby';
import * as AliOSS from 'ali-oss';
import chalk from 'chalk';

import { TaskPool, TaskPoolStatusInfo, TaskResultInfo } from './task-pool';
import { OSSConfig, OSSConfigInfo, TaskPoolConfig } from './../../config';
import { log } from './../../lib';

export interface OSSUploadResultInfo {
  total: number;
  succeed: number;
  failed: number;
}

/**
 * Operate static files using Aliyun OSS.
 *
 * @export
 * @class OSS
 */
export class OSS {
  private config: OSSConfigInfo;
  private client: any;

  constructor(options: OSSConfigInfo) {
    this.config = _.cloneDeep(options);
    this.client = new AliOSS(options);
  }

  /**
   * Upload static files, using glob patterns.
   *
   * @param {(string | string[])} patterns
   * @param {string} statics
   * @returns {Promise<boolean>}
   * @memberof OSS
   */
  async upload(patterns: string | string[], statics: string): Promise<boolean> {
    const files = globby.sync(patterns);

    const tasks = files.map((file: string) => {
      const name = file && Path.relative(statics, file);

      return new Promise(async (resolve, reject) =>
        resolve(await this.client.put(name, file))
      ).then((res: any) => Object.assign({}, res, (res && res.res) || {}));
    });

    log(
      chalk.yellow(`Upload begin, size of task pool: ${TaskPoolConfig.size}\n`)
    );

    return new Promise((resolve, reject) => {
      const taskPool = new TaskPool(tasks, {
        size: TaskPoolConfig.size,
        onEnd: (status: TaskPoolStatusInfo) => {
          log(
            chalk.yellow(
              `Upload finished, total: ${chalk.white(
                status.total + ''
              )}, succeed: ${chalk.green(
                status.succeed + ''
              )}, failed: ${chalk.gray(status.failed + '')}\n`
            )
          );
          resolve(status.failed === 0);
        },
        onEachEnd: (res: any, status: TaskPoolStatusInfo) =>
          log(
            chalk.cyan(
              `    upload progress: ${chalk.white(
                Math.floor((status.succeed * 100) / status.total) + '%'
              )} (${chalk.green(status.succeed + '')}/${chalk.white(
                status.total + ''
              )}) ${
                res.status === 200
                  ? chalk.yellow('succeed: ')
                  : chalk.red('failed: ')
              }${chalk.underline(res.name)}`
            )
          )
      });

      taskPool.start();
    }).then(res => !!res);
  }

  /**
   * Delete specific files by glob patterns.
   *
   * @param {(string | string[])} patterns
   * @param {string} statics
   * @returns {Promise<boolean>}
   * @memberof OSS
   */
  async delete(patterns: string | string[], statics: string): Promise<boolean> {
    const files = globby.sync(patterns);
    const objects = files.map(file => file && Path.relative(statics, file));
    const result = await this.client.deleteMulti(objects, {
      quiet: true
    });
    const succeed = result && result.res && result.res.status === 200;

    log(
      chalk.yellow(
        `Multi delete finished ${
          succeed ? chalk.green('succeed! ') : chalk.red('failed!')
        }\n`
      )
    );

    return succeed;
  }

  /**
   * Remove all static files.
   *
   * @returns
   * @memberof OSS
   */
  async remove() {
    const files = await this.list();
    const result = await this.client.deleteMulti(files);
    const succeed = result && result.res && result.res.status === 200;

    log(
      `Remove all files in bucket ${this.config.bucket} ${
        succeed ? chalk.green('succeed') : chalk.red('failed')
      }.\n`
    );

    return succeed;
  }

  /**
   * List all static files.
   *
   * @returns {Promise<string[]>}
   * @memberof OSS
   */
  async list(): Promise<string[]> {
    const result = await this.client.list();

    return result.res && result.res.status === 200
      ? ((result.objects && result.objects) || []).map((item: any) => item.name)
      : [];
  }

  download(patterns?: string | string[]) {
    //
  }
}
