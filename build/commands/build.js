"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const utils_1 = require("./../utils");
function build(name, dev) {
    const configPath = Path.resolve(__dirname, './../config/webpack/app.js');
    const srcPath = Path.resolve(name, 'init.tsx');
    const outPath = Path.resolve('dist');
    utils_1.exeCmd([
        `webpack${dev ? '-dev-server' : ''} --entry ${srcPath} --output-path ${outPath} --output-filename ${name}.js --config ${configPath} --color`
    ]);
    const appConfig = utils_1.getConfig(name);
    const { path, items } = appConfig.style;
    const styles = [];
    Object.keys(items || {}).map(key => {
        if (key && items[key]) {
            const source = Path.resolve(name, items[key]);
            const dist = Path.resolve('dist', name, appConfig.style.path, `${key}.css`);
            styles.push({
                source,
                dist
            });
        }
    });
    utils_1.buildStyle(Path.resolve(name, appConfig.style.path), styles, dev);
}
exports.build = build;
//# sourceMappingURL=build.js.map