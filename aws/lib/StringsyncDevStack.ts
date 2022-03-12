import {
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_s3,
  CfnOutput,
  Duration,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vod } from './constructs/Vod';

export class StringsyncDevStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vod = new Vod(this, 'Vod', {
      adminEmail: 'dev@stringsync.com',
      enableAcceleratedTranscoding: false,
      enableSns: false,
    });

    const mediaCachePolicy = new aws_cloudfront.CachePolicy(this, 'MediaCachePolicy', {
      defaultTtl: Duration.minutes(30),
      minTtl: Duration.minutes(30),
      maxTtl: Duration.minutes(60),
      cookieBehavior: aws_cloudfront.CacheCookieBehavior.none(),
      headerBehavior: aws_cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: aws_cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingGzip: true,
    });

    const mediaBucket = new aws_s3.Bucket(this, 'MediaBucket', {
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      cors: [
        {
          allowedMethods: [aws_s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    });

    const mediaDistribution = new aws_cloudfront.Distribution(this, 'MediaDistribution', {
      enabled: true,
      comment: 'Serves media from the dev media bucket',
      priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_ALL,
      defaultBehavior: {
        origin: new aws_cloudfront_origins.S3Origin(mediaBucket),
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: mediaCachePolicy,
      },
    });

    new CfnOutput(this, 'VideoSrcBucket', {
      exportName: 'VideoSrcBucket',
      value: vod.sourceBucket.bucketName,
    });

    new CfnOutput(this, 'MediaBucketName', {
      exportName: 'MediaBucketName',
      value: mediaBucket.bucketName,
    });

    new CfnOutput(this, 'MediaCdnDomainName', {
      exportName: 'MediaCdnDomainName',
      value: mediaDistribution.domainName,
    });
  }
}
