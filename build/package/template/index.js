"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const Fs = require("fs-extra");
const chalk_1 = require("chalk");
const lib_1 = require("./../../lib");
const website_page_1 = require("./website.page");
const spa_page_1 = require("./spa.page");
/**
 * Generate templates for command 'add'.
 *
 * @export
 * @param {string} path
 * @param {string} name
 * @param {WebsiteServerConfigInfo} config
 */
function generateWebsitePage(path, name, config) {
    const pathArray = path && path.match(/\w+/g) || [];
    const pathMap = {
        html: Path.resolve(config.server.view),
        jsx: Path.resolve(config.entryDir),
        scss: Path.resolve(config.entryDir, './../style')
    };
    pathArray.push(name);
    Object.keys(pathMap).map((ext) => {
        const targetDir = Path.resolve(pathMap[ext], path);
        const targetPath = Path.resolve(pathMap[ext], path, `${name}.${ext}`);
        Fs.ensureDirSync(targetDir);
        Fs.writeFileSync(targetPath, website_page_1.websitePageGenerator(pathArray.join('/'), ext));
        lib_1.log(`    ${chalk_1.default.yellow(ext)} generate successfully: ${chalk_1.default.blue(Path.relative(Path.resolve('./'), targetPath))}`);
    });
    lib_1.log(`Add page ${name} finished.`);
}
exports.generateWebsitePage = generateWebsitePage;
/**
 * Generate templates for command 'add'.
 *
 * @export
 * @param {string} path
 * @param {string} name
 * @param {WebsiteServerConfigInfo} config
 */
function generateSpaPage(path, name, config) {
    const pathArray = path && path.match(/^[\w\_\-]+$/g) || [];
    const pathMap = {
        tsx: Path.resolve(config.entry, './../page'),
        less: Path.resolve(config.entry, './../style')
    };
    pathArray.push(name);
    Object.keys(pathMap).map((ext) => {
        const targetDir = Path.resolve(pathMap[ext], path);
        const targetPath = Path.resolve(pathMap[ext], path, `${name}.${ext}`);
        Fs.ensureDirSync(targetDir);
        Fs.writeFileSync(targetPath, spa_page_1.spaPageGenerator(pathArray.join('/'), ext));
        lib_1.log(`    ${chalk_1.default.yellow(ext)} generate successfully: ${chalk_1.default.blue(Path.relative(Path.resolve('./'), targetPath))}`);
    });
    lib_1.log(`Add page finished.`);
}
exports.generateSpaPage = generateSpaPage;
//# sourceMappingURL=index.js.map