/// <reference types="moment" />
import * as Moment from 'moment';
export interface AppConfigInfo {
    server: {
        port: number;
        static: string[];
        views?: string;
        favicon: string;
    };
    style: {
        path: string;
        items: {
            [key: string]: string;
        };
    };
    mock: {
        path: string;
        active: boolean;
    };
}
export declare const DefaultAppConfig: AppConfigInfo;
export declare const AppEnvs: {
    dev: string;
    pro: string;
};
export declare enum AppStatus {
    offline = 1,
    online = 2,
    deleted = 3,
}
export declare const ProjectTypes: {
    [key: string]: string;
};
export interface AppInstance {
    script: string;
    config: AppConfigInfo;
    status: AppStatus;
    type: string;
    desc: string;
    created_at: Moment.Moment | undefined;
    updated_at: Moment.Moment | undefined;
    deleted_at: Moment.Moment | undefined;
}
export interface ServerOptions {
}
export declare class App {
    private config;
    static apps: {
        [key: string]: AppInstance;
    };
    constructor(options: ServerOptions);
    static start(name: string): boolean;
    static stop(name: string): any;
    static serve(name: string): any;
    static list(name: string): typeof App.list;
    static init(name: string, options: AppConfigInfo, desc?: string): void;
}
