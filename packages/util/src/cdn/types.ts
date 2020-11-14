export type CloudFrontCdnConfig = {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
};

export interface Cdn {
  getUrl(cdnId: string): Promise<string>;
}
