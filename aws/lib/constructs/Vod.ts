import * as s3 from '@aws-cdk/aws-s3';
import * as sqs from '@aws-cdk/aws-sqs';
import * as cfninc from '@aws-cdk/cloudformation-include';
import * as cdk from '@aws-cdk/core';

type VodProps = {
  adminEmail: string;
  enableSns: boolean;
  enableAcceleratedTranscoding: boolean;
};

export class Vod extends cdk.Construct {
  readonly template: cfninc.CfnInclude;
  readonly sourceBucket: s3.IBucket;
  readonly queue: sqs.IQueue;

  constructor(scope: cdk.Construct, id: string, props: VodProps) {
    super(scope, id);

    this.template = new cfninc.CfnInclude(scope, 'VodTemplate', {
      templateFile: 'templates/vod.yml',
      preserveLogicalIds: true,
      parameters: {
        AdminEmail: props.adminEmail,
        EnableSns: props.enableSns ? 'Yes' : 'No',
        AcceleratedTranscoding: props.enableAcceleratedTranscoding ? 'ENABLED' : 'DISABLED',
      },
    });

    const bucketName = this.template.getOutput('Source').value;
    this.sourceBucket = s3.Bucket.fromBucketName(scope, 'VodSourceBucket', bucketName);

    const queueArn = this.template.getOutput('SqsARN').value;
    this.queue = sqs.Queue.fromQueueArn(scope, 'VodSqsQueue', queueArn);
  }
}
