import { aws_s3, aws_sqs, cloudformation_include } from 'aws-cdk-lib';
import { Construct } from 'constructs';

type VodProps = {
  adminEmail: string;
  enableSns: boolean;
  enableAcceleratedTranscoding: boolean;
};

export class Vod extends Construct {
  readonly template: cloudformation_include.CfnInclude;
  readonly sourceBucket: aws_s3.IBucket;
  readonly queue: aws_sqs.IQueue;

  constructor(scope: Construct, id: string, props: VodProps) {
    super(scope, id);

    this.template = new cloudformation_include.CfnInclude(scope, 'VodTemplate', {
      templateFile: 'templates/vod.yml',
      parameters: {
        AdminEmail: props.adminEmail,
        EnableSns: props.enableSns ? 'Yes' : 'No',
        AcceleratedTranscoding: props.enableAcceleratedTranscoding ? 'ENABLED' : 'DISABLED',
      },
    });

    const bucketName = this.template.getOutput('Source').value;
    this.sourceBucket = aws_s3.Bucket.fromBucketName(scope, 'VodSourceBucket', bucketName);

    const queueArn = this.template.getOutput('SqsARN').value;
    this.queue = aws_sqs.Queue.fromQueueArn(scope, 'VodSqsQueue', queueArn);
  }
}
