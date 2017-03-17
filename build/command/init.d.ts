export declare const InitNames: {
    lib: string;
    koa: string;
    express: string;
};
export interface InitOptionsInfo {
}
export declare const DefaultInitOptions: InitOptionsInfo;
export declare function init(name: string, options?: InitOptionsInfo): void;
