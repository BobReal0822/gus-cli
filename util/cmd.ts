import * as Fs from 'fs-extra';
import * as Path from 'path';

/**
 * Get project type of the gus app from 'package.json'
 *
 * @export
 * @param {string} path
 * @returns {string}
 */
export function getProjectInfo(path: string): {
  name: string;
  type: string;
} {
  let res = {
    name: '',
    type: ''
  };

  const filePath = Path.resolve(path, 'package.json');

  if (path && Fs.pathExistsSync(filePath) && Fs.lstatSync(filePath).isFile()) {
    const packFile = Fs.readFileSync(filePath);

    if (packFile) {
      const { name, type } = JSON.parse(packFile.toString()) || <any> {};

      res = Object.assign({}, {
        name,
        type
      });
    }
  }

  return res;
}
