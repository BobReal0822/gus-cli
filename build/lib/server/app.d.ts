/// <reference types="moment" />
import * as Moment from 'moment';
export interface AppOptions {
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
export interface AppInstance {
    script: string;
    config: AppOptions;
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
    static stopApp(name: string): void;
    static list(name: string): void;
    static deleteApp(name: string): boolean;
    static init(name: string, options: AppOptions, desc?: string): void;
}
