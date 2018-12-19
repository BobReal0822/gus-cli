export interface OSSConfigInfo {
    region: string;
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
}
export declare const OSSConfig: OSSConfigInfo;
export declare const TaskPoolConfig: {
    size: number;
};
