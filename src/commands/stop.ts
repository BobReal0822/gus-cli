import { AppOptions, App } from './../lib/server/app';

export function stop(name: string) {
  App.stop(name);
}
