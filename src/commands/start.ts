import { getConfig } from './../utils';
import { AppOptions, App } from './../lib/server/app';

export function start(name: string) {
  const config = getConfig(name);
  const options: AppOptions = Object.assign({}, config.server);

  App.init(name, options);
  App.start(name);
}
