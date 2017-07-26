import { Server, IAppOptions } from './../lib/server/app';


export function start(name: string) {
    // return '';
    const options: IAppOptions = {
        port: 3002
    };

    Server.initApp(name, options);
    Server.startApp(name);
}
