import * as Path from 'path';
import * as Fs from 'fs-extra';
import * as _ from 'lodash';

export interface MockDataInfo {
  path: string;
  method: 'get' | 'post' | 'delete' | 'head' | 'put';
  data: {};
}

/**
 * Get server config data.
 *
 * @export
 * @param {string} path
 * @returns {T}
 */
export function getConfig<T>(path: string, defaultConfig: T): T {
  if (!(path && Fs.pathExistsSync(path) && Fs.statSync(path).isFile())) {
    return _.cloneDeep(defaultConfig);
  }

  const config: T = JSON.parse(Fs.readFileSync(path, 'utf-8')) || {};

  return _.cloneDeep(Object.assign({}, defaultConfig, config));
}

export function loadRoutes(path: string): MockDataInfo[] {
  const fileRegex = /\.js$/;
  let data: MockDataInfo[] = [];

  if (Fs.pathExistsSync(path)) {

    Fs.readdirSync(path).map((file: string) => {
      if (file && fileRegex.test(file)) {
        const filePath = Path.resolve(path, file);

        if (Fs.statSync(filePath).isFile()) {
          // tslint:disable-next-line
          const module = require(filePath);
          const defaultData: MockDataInfo[] = module && module.default || [];

          if (defaultData && defaultData.length) {
            data = data.concat(defaultData);
          }
        } else if (Fs.statSync(filePath).isDirectory()) {
          data = data.concat(loadRoutes(filePath));
        }
      }
    });
  }

  return data;
}
