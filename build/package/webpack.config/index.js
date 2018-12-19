"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Fs = require("fs-extra");
const common_1 = require("./common");
/**
 * Generate webpack config according to options.
 *
 * @export
 * @param {WebpackConfigInfo} options
 * @param {string} outDir
 * @param {boolean} [useOss=false]
 * @param {string} [fileName]
 * @returns {string}
 */
function webpackConfigGenerator(options, outDir, useOss = false, fileName) {
    const config = common_1.webpackConfig(options, useOss);
    const configPath = Path.resolve(outDir, fileName || 'webpack.config.js');
    Fs.ensureDirSync(outDir);
    Fs.writeFileSync(configPath, config);
    return configPath;
}
exports.webpackConfigGenerator = webpackConfigGenerator;
//# sourceMappingURL=index.js.map