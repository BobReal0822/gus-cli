export interface WebpackConfigInfo {
    entry: {
        [key: string]: string | string[];
    };
    viewDir: string;
    staticDir: string;
    distDir: string;
    dev?: boolean;
    preDeploy?: boolean;
}
/**
 * Return webpack config according to options.
 *
 * @param {WebpackConfigInfo} options
 * @param {boolean} useOss
 * @returns
 */
export declare const webpackConfig: (options: WebpackConfigInfo, useOss: boolean) => string;
