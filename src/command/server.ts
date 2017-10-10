import { IAppOptions, Server } from './../lib/server/app';


export function start(name: string) {
    // return '';
    const options: IAppOptions = {
        port: 5000
    };

    Server.initApp(name, options);
    Server.startApp(name);
}
