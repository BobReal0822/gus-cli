export interface AppConfigInfo {
    server: {
        port: number;
        static: string[];
    };
    style: {
        path: string;
        items: {
            [key: string]: string;
        };
    };
}
/**
 * Get package version.
 *
 * @export getVersion
 * @returns {string}
 */
export declare function getVersion(): string;
export declare const log: any;
export declare function getProjectType(path: string): string;
export declare function exeCmd(cmds: string[], noOut?: boolean): void;
export declare function getConfig(name: string): AppConfigInfo;
export declare function buildStyle(dir: string, styles: {
    source: string;
    dist: string;
}[], watch?: boolean): void;
export declare function setMaxListeners(): void;
