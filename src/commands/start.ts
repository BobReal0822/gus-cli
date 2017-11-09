import { AppOptions, App } from './../lib/server/app';

export function start(name: string) {
    const options: AppOptions = {
        port: 5000
    };

    App.init(name, options);
    App.start(name);
}
