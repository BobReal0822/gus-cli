import { WebsiteServerConfigInfo, SpaServerConfigInfo } from './../package';
export declare const AppTypes: {
    website: string;
    spa: string;
};
export declare const DefaultWebsiteServerConfig: WebsiteServerConfigInfo;
export declare const DefaultSpaServerConfig: SpaServerConfigInfo;
/**
 * Entry for command 'build'
 *
 * @export
 * @param {boolean} [dev=false]
 * @param {boolean} [watch]
 *
 * @const {string} [env = 'development' | 'production' | 'no-login']
 */
export declare function build(dev?: boolean, watch?: boolean, preDeploy?: boolean): void;
