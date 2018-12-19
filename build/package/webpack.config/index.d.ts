import { WebpackConfigInfo } from './common';
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
export declare function webpackConfigGenerator(options: WebpackConfigInfo, outDir: string, useOss?: boolean, fileName?: string): string;
