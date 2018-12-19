/**
 * Get the version of gus.
 *
 * @export
 * @returns {string}
 */
export declare function getVersion(): string;
/**
 * Execute commands by child_process.exec .
 *
 * @export
 * @param {string[]} cmds
 * @param {boolean} [noOut]
 */
export declare function exeCmd(cmds: string[], noOut?: boolean): void;
export interface FileInfo {
    name: string;
    path: string;
    ext: string;
}
/**
 * Get files under a dir.
 *
 * @export
 * @param {string} dir
 * @param {string} [originPath]
 * @returns {FileInfo[]}
 */
export declare function getFiles(dir: string, originPath?: string): FileInfo[];
