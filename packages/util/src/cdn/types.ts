export type CloudFrontCdnConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

export interface Cdn {
  getDomainName(cdnId: string): Promise<string>;
}
