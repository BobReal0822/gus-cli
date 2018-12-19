import { OSSConfigInfo } from './../../config';
export interface OSSUploadResultInfo {
    total: number;
    succeed: number;
    failed: number;
}
/**
 * Operate static files using Aliyun OSS.
 *
 * @export
 * @class OSS
 */
export declare class OSS {
    private config;
    private client;
    constructor(options: OSSConfigInfo);
    /**
     * Upload static files, using glob patterns.
     *
     * @param {(string | string[])} patterns
     * @param {string} statics
     * @returns {Promise<boolean>}
     * @memberof OSS
     */
    upload(patterns: string | string[], statics: string): Promise<boolean>;
    /**
     * Delete specific files by glob patterns.
     *
     * @param {(string | string[])} patterns
     * @param {string} statics
     * @returns {Promise<boolean>}
     * @memberof OSS
     */
    delete(patterns: string | string[], statics: string): Promise<boolean>;
    /**
     * Remove all static files.
     *
     * @returns
     * @memberof OSS
     */
    remove(): Promise<boolean>;
    /**
     * List all static files.
     *
     * @returns {Promise<string[]>}
     * @memberof OSS
     */
    list(): Promise<string[]>;
    download(patterns?: string | string[]): void;
}
