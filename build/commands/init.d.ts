export interface InitOptionsInterface {
}
export interface InitNameInterface {
    [key: string]: {
        value: string;
        desc: string;
    };
}
export declare const DefaultInitOptions: InitOptionsInterface;
export declare const InitTypeMapping: InitNameInterface;
export declare function init(type: string, name: string, options?: any): void;
