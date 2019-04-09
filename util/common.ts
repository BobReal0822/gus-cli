import * as Path from 'path';
import { exec } from 'child_process';
import * as Process from 'process';

import * as Fs from 'fs-extra';

const packagePath = Path.join(__dirname, './../..', 'package.json');

/**
 * Get the version of gus.
 *
 * @export
 * @returns {string}
 */
export function getVersion(): string {
  const packageInfo = JSON.parse(Fs.readFileSync(packagePath, 'utf8'));

  return (packageInfo && packageInfo.version) || 'Version invalid!';
}

/**
 * Execute commands by child_process.exec .
 *
 * @export
 * @param {string[]} cmds
 * @param {boolean} [noOut]
 */
export function exeCmd(cmds: string[], noOut?: boolean) {
  cmds.map((cmd: string) => {
    if (cmd) {
      const exe = exec(`${cmd} --color`, {
        maxBuffer: 10 * 1024 * 1024
      });

      if (!noOut) {
        if (exe && exe.stdout && exe.stdout.pipe) {
          exe.stdout.pipe(Process.stdout);
        }
        exe.on('exit', (code, signal) => {
          // log.warning(`child process [ ${ cmd } ] exited with code ${ code.toString()}, signal: ${ signal }`);
        });
      }

      if (exe && exe.stderr && exe.stderr.pipe) {
        exe.stderr.pipe(Process.stderr);
      }
      exe.on('error', (err: any) => {
        throw new Error(`${cmd}: ${err}`);
      });
    }
  });
}

export interface FileInfo {
  name: string;
  path: string;
  ext: string;
}

/**
 * Get files under a dir.
 *
 * @export
 * @param {string} dir
 * @param {string} [originPath]
 * @returns {FileInfo[]}
 */
export function getFiles(dir: string, originPath?: string): FileInfo[] {
  if (!Fs.statSync(dir).isDirectory()) {
    return [];
  }

  let res: FileInfo[] = [];
  const relativePath = originPath || dir;

  Fs.readdirSync(dir).map((item: string) => {
    const itemPath = Path.resolve(dir, item);
    const stat = Fs.statSync(itemPath);

    if (stat.isFile()) {
      const reg = /\.\w+$/;
      const ext = item && (reg.exec(item) || [])[0];
      const name = item.substr(0, item.length - ext.length);
      const path = Path.relative(relativePath, itemPath);

      res.push({
        name,
        ext,
        path
      });
    } else if (stat.isDirectory()) {
      res = [...res, ...getFiles(itemPath, relativePath)];
    }
  });

  return res;
}
