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
const Chai = require("chai");
const Path = require("path");
const package_1 = require("./../package");
const config_1 = require("./../config");
const { assert, expect } = Chai;
const should = Chai.should();
describe('oss tests: ', () => {
    describe('upload: ', () => {
        it('should upload successfully: ', () => __awaiter(this, void 0, void 0, function* () {
            const files = Path.resolve('./haha/');
            const oss = new package_1.OSS(config_1.OSSConfig);
            const uploadResult = yield oss.upload(files, Path.resolve('./'));
            uploadResult.should.be.true;
        }));
    });
    describe('upload & delete: ', () => {
        it('should delete successfully: ', () => __awaiter(this, void 0, void 0, function* () {
            const files = Path.resolve('./haha/');
            const oss = new package_1.OSS(config_1.OSSConfig);
            const uploadResult = yield oss.upload(files, Path.resolve('./'));
            uploadResult.should.be.true;
            const deleteResult = yield oss.delete(files, Path.resolve('./'));
            deleteResult.should.be.true;
        }));
    });
});
//# sourceMappingURL=oss.js.map