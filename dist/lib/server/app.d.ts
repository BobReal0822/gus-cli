/// <reference types="koa" />
/// <reference types="koa-router" />
/// <reference types="koa-views" />
/// <reference types="moment" />
import * as Koa from 'koa';
import * as Moment from 'moment';
export interface IAppOptions {
    port: number;
    staticPaths?: string[];
    viewPath?: string;
    desc?: string;
}
export declare enum AppStatus {
    offline = 1,
    online = 2,
    deleted = 3,
}
export declare const ProjectTypes: {
    [key: string]: string;
};
export interface IAppInstance {
    instance: Koa;
    config: IAppOptions;
    status: AppStatus;
    type: string;
    desc: string;
    created_at: Moment.Moment | undefined;
    updated_at: Moment.Moment | undefined;
    deleted_at: Moment.Moment | undefined;
}
export interface IServerOptions {
}
export declare class Server {
    private config;
    static apps: {
        [key: string]: IAppInstance;
    };
    constructor(options: IServerOptions);
    static startApp(name: string): boolean;
    static stopApp(name: string): void;
    static deleteApp(name: string): boolean;
    static initApp(name: string, options: IAppOptions, desc?: string): void;
}
