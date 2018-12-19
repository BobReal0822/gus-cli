export interface InitOptionsInterface {
}
export interface InitNameInterface {
    [key: string]: {
        cmd: string;
        desc: string;
    };
}
export declare const InitTypeMapping: InitNameInterface;
/**
 * Entry for command 'init'.
 *
 * @export
 * @param {string} type
 * @param {string} name
 * @param {*} [options]
 */
export declare function init(type: string, name: string, options?: any): void;
