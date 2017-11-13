import * as Path from 'path';
import { log, exeCmd, getConfig, buildStyle } from './../utils';

export function build(name: string, dev?: boolean) {
  const configPath = Path.resolve(__dirname, './../config/webpack/build.js');
  const srcPath = Path.resolve(name, 'init.tsx');
  const outPath = Path.resolve('dist');

  exeCmd([
    `tsc ${ dev ? '-w' : '' }`,
    `webpack --entry ${ srcPath } --output-path ${ outPath } --output-filename ${ name }.js --config ${ configPath } --color`
  ]);

  const appConfig = getConfig(name);
  const { path, items } = appConfig.style;
  const styles: {
    source: string;
    dist: string;
  }[] = [];

  Object.keys(items || {}).map(key => {
    if (key && items[key]) {
      const source = Path.resolve(name, items[key]);
      const dist = Path.resolve('dist', name, appConfig.style.path, `${ key }.css`);


      styles.push({
        source,
        dist
      });
    }
  });

  buildStyle(Path.resolve(name, appConfig.style.path), styles, dev);
}
