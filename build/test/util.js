"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Chai = require("chai");
const Path = require("path");
const util_1 = require("./../util");
const { assert, expect } = Chai;
const should = Chai.should();
describe('util tests:', () => {
    describe('getFiles', () => {
        it('should get file list: ', () => {
            const dir = Path.resolve(__dirname, './../../test/data/get-files');
            const files = util_1.getFiles(dir) || [];
            files.should.have.length(5);
        });
    });
});
//# sourceMappingURL=util.js.map