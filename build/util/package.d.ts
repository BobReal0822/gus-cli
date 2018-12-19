export interface MockDataInfo {
    path: string;
    method: 'get' | 'post' | 'delete' | 'head' | 'put';
    data: {};
}
/**
 * Get server config data.
 *
 * @export
 * @param {string} path
 * @returns {T}
 */
export declare function getConfig<T>(path: string, defaultConfig: T): T;
export declare function loadRoutes(path: string): MockDataInfo[];
