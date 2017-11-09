import * as Fs from 'fs-extra';
import * as Path from 'path';

import { AppConfig } from './../config';
import { generateApp, log, exeCmd } from './../utils';

export function stop(name: string) {
  const script = Path.resolve(AppConfig.appPath, `${ name }.js`);

  if (!name || !Fs.existsSync(script)) {
    return log.error(`app ${ name } does not exist.`);
  }

  try {
    Fs.unlinkSync(script);
    exeCmd(`pm2 stop ${ name }`);

    log(`stop ${ name } successfully.`);
  } catch (err) {
    throw new Error(`stop ${ name } failed: ${ err }`);
  }
}
