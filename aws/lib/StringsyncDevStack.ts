import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as s3 from '@aws-cdk/aws-s3';
import * as cdk from '@aws-cdk/core';
import { Vod } from './constructs/Vod';

export class StringsyncDevStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vod = new Vod(this, 'Vod', {
      adminEmail: 'dev@stringsync.com',
      enableAcceleratedTranscoding: false,
      enableSns: false,
    });

    const mediaCachePolicy = new cloudfront.CachePolicy(this, 'MediaCachePolicy', {
      defaultTtl: cdk.Duration.minutes(30),
      minTtl: cdk.Duration.minutes(30),
      maxTtl: cdk.Duration.minutes(60),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingGzip: true,
    });

    const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    });

    const mediaDistribution = new cloudfront.Distribution(this, 'MediaDistribution', {
      enabled: true,
      comment: 'Serves media',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      defaultBehavior: {
        origin: new origins.S3Origin(mediaBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: mediaCachePolicy,
      },
    });

    new cdk.CfnOutput(this, 'VideoSrcBucket', {
      exportName: 'VideoSrcBucket',
      value: vod.sourceBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'MediaBucketName', {
      exportName: 'MediaBucketName',
      value: mediaBucket.bucketName,
    });

    new cdk.CfnOutput(this, 'MediaCdnDomainName', {
      exportName: 'MediaCdnDomainName',
      value: mediaDistribution.domainName,
    });
  }
}
