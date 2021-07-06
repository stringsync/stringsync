import * as ec2 from '@aws-cdk/aws-ec2';
import * as cdk from '@aws-cdk/core';

export class Network extends cdk.Construct {
  readonly vpc: ec2.Vpc;
  readonly publicSubnet1: ec2.ISubnet;
  readonly publicSubnet2: ec2.ISubnet;
  readonly privateSubnet1: ec2.ISubnet;
  readonly privateSubnet2: ec2.ISubnet;

  constructor(scope: cdk.Construct, id: string) {
    super(scope, id);

    this.vpc = new ec2.Vpc(this, 'VPC', {
      cidr: '10.0.0.0/16',
      enableDnsSupport: true,
      enableDnsHostnames: true,
      maxAzs: 2,
    });

    this.publicSubnet1 = this.vpc.publicSubnets[0];
    this.publicSubnet2 = this.vpc.publicSubnets[1];
    this.privateSubnet1 = this.vpc.privateSubnets[0];
    this.privateSubnet2 = this.vpc.privateSubnets[1];
  }
}
