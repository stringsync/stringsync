import * as ec2 from '@aws-cdk/aws-ec2';
import * as elasticache from '@aws-cdk/aws-elasticache';
import * as cdk from '@aws-cdk/core';

type CacheProps = {
  vpc: ec2.IVpc;
};

export class Cache extends cdk.Construct {
  readonly cluster: elasticache.CfnCacheCluster;
  readonly subnetGroup: elasticache.CfnSubnetGroup;
  readonly securityGroup: ec2.CfnSecurityGroup;

  constructor(scope: cdk.Construct, id: string, props: CacheProps) {
    super(scope, id);

    this.securityGroup = new ec2.CfnSecurityGroup(this, 'CacheSecurityGroup', {
      groupDescription: 'Access to the Elasticcache service',
      vpcId: props.vpc.vpcId,
    });

    this.subnetGroup = new elasticache.CfnSubnetGroup(this, 'CacheSubnet', {
      description: 'Cache Subnet Group',
      subnetIds: props.vpc.privateSubnets.map((subnet) => subnet.subnetId),
    });

    this.cluster = new elasticache.CfnCacheCluster(this, 'CacheCluster', {
      engine: 'redis',
      engineVersion: '5.0.0',
      cacheNodeType: 'cache.t2.micro',
      numCacheNodes: 1,
      clusterName: 'Cache',
      vpcSecurityGroupIds: [this.securityGroup.attrGroupId],
      cacheSubnetGroupName: this.subnetGroup.ref,
    });
  }
}
