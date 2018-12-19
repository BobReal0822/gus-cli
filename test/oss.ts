import * as Chai from 'chai';
import * as Mocha from 'mocha';
import * as Path from 'path';

import { OSS } from './../package';
import { OSSConfig } from './../config';

const { assert, expect } = Chai;
const should = Chai.should();

describe('oss tests: ', () => {
  describe('upload: ', () => {
    it('should upload successfully: ', async () => {
      const files = Path.resolve('./haha/');
      const oss = new OSS(OSSConfig);
      const uploadResult = await oss.upload(files, Path.resolve('./'));

      uploadResult.should.be.true;
    });
  });

  describe('upload & delete: ', () => {
    it('should delete successfully: ', async () => {
      const files = Path.resolve('./haha/');
      const oss = new OSS(OSSConfig);
      const uploadResult = await oss.upload(files, Path.resolve('./'));

      uploadResult.should.be.true;

      const deleteResult = await oss.delete(files, Path.resolve('./'));

      deleteResult.should.be.true;
    });
  });
});