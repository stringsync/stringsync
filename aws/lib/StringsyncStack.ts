import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';
import { App } from './constructs/App';
import { Cache } from './constructs/Cache';
import { CI } from './constructs/CI';
import { Network } from './constructs/Network';

const APP_ENABLED = false;

export class StringsyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const network = new Network(this, 'Network');

    const ci = new CI(this, 'CI', {
      repoName: 'stringsync',
      accountId: this.account,
    });

    const db = new rds.DatabaseInstance(this, 'Database', {
      vpc: network.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE,
      },
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_11 }),
    });

    const cache = new Cache(this, 'Cache', {
      vpc: network.vpc,
    });

    if (APP_ENABLED) {
      const app = new App(this, 'App', {
        vpc: network.vpc,
        appRepository: ci.appRepository,
        workerRepository: ci.workerRepository,
      });
      ci.addDeployments(app.appService, app.workerService);
    }
  }
}
