

export interface OSSConfigInfo {
  region: string;
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
}

export const OSSConfig: OSSConfigInfo = {
  region: 'oss-cn-beijing',
  accessKeyId: '***',
  accessKeySecret: '***',
  bucket: '***'
};

export const TaskPoolConfig = {
  size: 10
};
