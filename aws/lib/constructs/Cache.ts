import { aws_ec2, aws_elasticache } from 'aws-cdk-lib';
import { Construct } from 'constructs';

type CacheProps = {
  vpc: aws_ec2.IVpc;
};

export class Cache extends Construct {
  readonly cluster: aws_elasticache.CfnCacheCluster;
  readonly subnetGroup: aws_elasticache.CfnSubnetGroup;
  readonly securityGroup: aws_ec2.SecurityGroup;
  readonly port: number;

  constructor(scope: Construct, id: string, props: CacheProps) {
    super(scope, id);

    this.port = 6379;

    this.securityGroup = new aws_ec2.SecurityGroup(this, 'CacheSecurityGroup', {
      description: 'Access to the Elasticcache service',
      vpc: props.vpc,
    });

    this.subnetGroup = new aws_elasticache.CfnSubnetGroup(this, 'CacheSubnet', {
      description: 'Cache Subnet Group',
      subnetIds: props.vpc.selectSubnets({
        subnetType: aws_ec2.SubnetType.ISOLATED,
      }).subnetIds,
    });

    this.cluster = new aws_elasticache.CfnCacheCluster(this, 'CacheCluster', {
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
