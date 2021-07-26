import * as ec2 from '@aws-cdk/aws-ec2';
import * as elasticache from '@aws-cdk/aws-elasticache';
import * as cdk from '@aws-cdk/core';

type CacheProps = {
  vpc: ec2.IVpc;
};

export class Cache extends cdk.Construct {
  readonly cluster: elasticache.CfnCacheCluster;
  readonly subnetGroup: elasticache.CfnSubnetGroup;
  readonly securityGroup: ec2.SecurityGroup;
  readonly port: number;

  constructor(scope: cdk.Construct, id: string, props: CacheProps) {
    super(scope, id);

    this.port = 6379;

    this.securityGroup = new ec2.SecurityGroup(this, 'CacheSecurityGroup', {
      description: 'Access to the Elasticcache service',
      vpc: props.vpc,
    });

    this.subnetGroup = new elasticache.CfnSubnetGroup(this, 'CacheSubnet', {
      description: 'Cache Subnet Group',
      subnetIds: props.vpc.selectSubnets({
        subnetType: ec2.SubnetType.ISOLATED,
      }).subnetIds,
    });

    this.cluster = new elasticache.CfnCacheCluster(this, 'CacheCluster', {
      engine: 'redis',
      port: this.port,
      engineVersion: '5.0.0',
      cacheNodeType: 'cache.t2.micro',
      numCacheNodes: 1,
      clusterName: 'Redis',
      vpcSecurityGroupIds: [this.securityGroup.securityGroupId],
      cacheSubnetGroupName: this.subnetGroup.ref,
    });
  }

  get host(): string {
    return this.cluster.attrRedisEndpointAddress;
  }
}
