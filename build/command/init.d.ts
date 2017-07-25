export interface InitOptionsInterface {
}
export interface InitNameInterface {
    [key: string]: {
        value: string;
        desc: string;
    };
}
export declare const DefaultInitOptions: InitOptionsInterface;
export declare const InitNameMapping: InitNameInterface;
export declare function init(name: string, options?: InitOptionsInterface): void;
