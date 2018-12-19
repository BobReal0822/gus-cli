import * as Path from 'path';

import { getConfig } from './../util';
import { WebsiteServerConfigInfo, OSS } from './../package';
import { OSSConfig } from './../config';
import { DefaultWebsiteServerConfig } from './';

/**
 * Entry for command publish.
 *
 * @export
 * @param {boolean} clear
 */
export async function publish(clear: boolean) {
  const config = getConfig<WebsiteServerConfigInfo>(Path.resolve('./config.json'), DefaultWebsiteServerConfig);
  const { server, outDir } = config;

  const staticGlob = Path.resolve(outDir, server.static);
  const relativeGlob = Path.resolve(outDir);
  const oss = new OSS(OSSConfig);

  if (clear) {
    await oss.delete(staticGlob, relativeGlob);
  }

  await oss.upload(staticGlob, relativeGlob);
}
