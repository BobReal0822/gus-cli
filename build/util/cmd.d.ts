/**
 * Get project type of the gus app from 'package.json'
 *
 * @export
 * @param {string} path
 * @returns {string}
 */
export declare function getProjectInfo(path: string): {
    name: string;
    type: string;
};
