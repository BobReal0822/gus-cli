import { WebsiteServerConfigInfo, SpaServerConfigInfo } from './../../package';
/**
 * Generate templates for command 'add'.
 *
 * @export
 * @param {string} path
 * @param {string} name
 * @param {WebsiteServerConfigInfo} config
 */
export declare function generateWebsitePage(path: string, name: string, config: WebsiteServerConfigInfo): void;
/**
 * Generate templates for command 'add'.
 *
 * @export
 * @param {string} path
 * @param {string} name
 * @param {WebsiteServerConfigInfo} config
 */
export declare function generateSpaPage(path: string, name: string, config: SpaServerConfigInfo): void;
