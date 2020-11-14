import { NotFoundError } from '@stringsync/common';
import { CloudFront } from 'aws-sdk';
import { Cdn, CloudFrontCdnConfig } from './types';

export class CloudFrontCdn implements Cdn {
  static create(config: CloudFrontCdnConfig) {
    const cloudFront = new CloudFront({
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
      region: config.region,
    });
    return new CloudFrontCdn(cloudFront);
  }

  cloudFront: CloudFront;

  private domainNameByCdnId: { [key: string]: string } = {};

  constructor(cloudFront: CloudFront) {
    this.cloudFront = cloudFront;
  }

  async getUrl(cdnId: string) {
    // check cache
    if (cdnId in this.domainNameByCdnId) {
      return this.domainNameByCdnId[cdnId];
    }

    const res = await this.cloudFront.getDistribution({ Id: cdnId }).promise();

    const distribution = res.Distribution;
    if (!distribution) {
      throw new NotFoundError(`distribution not found for: ${cdnId}`);
    }

    const domainName = distribution.DomainName;
    if (!domainName) {
      throw new NotFoundError(`distribution not found for: ${cdnId}`);
    }

    // populate cache
    this.domainNameByCdnId[cdnId] = domainName;

    return domainName;
  }
}
