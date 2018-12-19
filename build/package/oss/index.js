"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const _ = require("lodash");
const Globby = require("globby");
const AliOSS = require("ali-oss");
const chalk_1 = require("chalk");
const task_pool_1 = require("./task-pool");
const config_1 = require("./../../config");
const lib_1 = require("./../../lib");
/**
 * Operate static files using Aliyun OSS.
 *
 * @export
 * @class OSS
 */
class OSS {
    constructor(options) {
        this.config = _.cloneDeep(options);
        this.client = new AliOSS(options);
    }
    /**
     * Upload static files, using glob patterns.
     *
     * @param {(string | string[])} patterns
     * @param {string} statics
     * @returns {Promise<boolean>}
     * @memberof OSS
     */
    upload(patterns, statics) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = Globby.sync(patterns);
            const tasks = files.map((file) => {
                const name = file && Path.relative(statics, file);
                return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () { return resolve(yield this.client.put(name, file)); }))
                    .then((res) => Object.assign({}, res, res && res.res || {}));
            });
            lib_1.log(chalk_1.default.yellow(`Upload begin, size of task pool: ${config_1.TaskPoolConfig.size}\n`));
            return new Promise((resolve, reject) => {
                const taskPool = new task_pool_1.TaskPool(tasks, {
                    size: config_1.TaskPoolConfig.size,
                    onEnd: (status) => {
                        lib_1.log(chalk_1.default.yellow(`Upload finished, total: ${chalk_1.default.white(status.total + '')}, succeed: ${chalk_1.default.green(status.succeed + '')}, failed: ${chalk_1.default.gray(status.failed + '')}\n`));
                        resolve(status.failed === 0);
                    },
                    onEachEnd: (res, status) => lib_1.log(chalk_1.default.cyan(`    upload progress: ${chalk_1.default.white(Math.floor(status.succeed * 100 / status.total) + '%')} (${chalk_1.default.green(status.succeed + '')}/${chalk_1.default.white(status.total + '')}) ${res.status === 200 ? chalk_1.default.yellow('succeed: ') : chalk_1.default.red('failed: ')}${chalk_1.default.underline(res.name)}`))
                });
                taskPool.start();
            }).then(res => !!res);
        });
    }
    /**
     * Delete specific files by glob patterns.
     *
     * @param {(string | string[])} patterns
     * @param {string} statics
     * @returns {Promise<boolean>}
     * @memberof OSS
     */
    delete(patterns, statics) {
        return __awaiter(this, void 0, void 0, function* () {
            const files = Globby.sync(patterns);
            const objects = files.map(file => file && Path.relative(statics, file));
            const result = yield this.client.deleteMulti(objects, {
                quiet: true
            });
            const succeed = result && result.res && result.res.status === 200;
            lib_1.log(chalk_1.default.yellow(`Multi delete finished ${succeed ? chalk_1.default.green('succeed! ') : chalk_1.default.red('failed!')}\n`));
            return succeed;
        });
    }
    /**
     * Remove all static files.
     *
     * @returns
     * @memberof OSS
     */
    remove() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield this.list();
            const result = yield this.client.deleteMulti(files);
            const succeed = result && result.res && result.res.status === 200;
            lib_1.log(`Remove all files in bucket ${this.config.bucket} ${succeed ? chalk_1.default.green('succeed') : chalk_1.default.red('failed')}.\n`);
            return succeed;
        });
    }
    /**
     * List all static files.
     *
     * @returns {Promise<string[]>}
     * @memberof OSS
     */
    list() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.client.list();
            return result.res && result.res.status === 200 ? (result.objects && result.objects || []).map((item) => item.name) : [];
        });
    }
    download(patterns) {
        //
    }
}
exports.OSS = OSS;
//# sourceMappingURL=index.js.map