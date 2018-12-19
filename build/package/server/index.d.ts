export interface BaseServerConfigInfo {
    outDir: string;
    server: {
        port: number;
        static: string;
        view: string;
    };
}
export declare type WebsiteServerConfigInfo = BaseServerConfigInfo & {
    entryDir: string;
};
export declare type SpaServerConfigInfo = BaseServerConfigInfo & {
    entry: string;
    mock: {
        path: string;
        active: boolean;
    };
};
/**
 * Operate node server.
 *
 * @export
 * @class Server
 * @template T
 */
export declare class Server<T extends BaseServerConfigInfo> {
    private name;
    private config;
    /**
     * Creates an instance of Server.
     * @param {string} name
     * @param {T} config
     * @param {*} [options]
     * @memberof Server
     */
    constructor(name: string, config: T, options?: any);
    /**
     * Init node server by generating 'server.js'
     *
     * @returns
     * @memberof Server
     */
    init(): this;
    static start(name: string): void;
    static stop(name: string): void;
    /**
     * Generate node server according config.
     *
     * @private
     * @returns
     * @memberof Server
     */
    private generate;
}
