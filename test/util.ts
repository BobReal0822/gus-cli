import * as Chai from 'chai';
import * as Mocha from 'mocha';
import * as Path from 'path';

import { getFiles } from './../util';

const { assert, expect } = Chai;
const should = Chai.should();

describe('util tests:', () => {
  describe('getFiles', () => {
    it('should get file list: ', () => {
      const dir = Path.resolve(__dirname, './../../test/data/get-files');
      const files = getFiles(dir) || [];

      files.should.have.length(5);
    });
  });
});
