import * as Path from 'path';
import * as Fs from 'fs-extra';
import { webpackConfig, WebpackConfigInfo } from './common';

/**
 * Generate webpack config according to options.
 *
 * @export
 * @param {WebpackConfigInfo} options
 * @param {string} outDir
 * @param {boolean} [useOss=false]
 * @param {string} [fileName]
 * @returns {string}
 */
export function webpackConfigGenerator(options: WebpackConfigInfo, outDir: string, useOss = false, fileName?: string): string {
  const config = webpackConfig(options, useOss);
  const configPath = Path.resolve(outDir, fileName || 'webpack.config.js');

  Fs.ensureDirSync(outDir);
  Fs.writeFileSync(configPath, config);

  return configPath;
}
