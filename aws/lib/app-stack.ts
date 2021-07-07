import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as cdk from '@aws-cdk/core';
import { App } from './constructs/app';
import { Cache } from './constructs/cache';
import { CI } from './constructs/ci';
import { Network } from './constructs/network';

const APP_ENABLED = false;

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const network = new Network(this, 'Network');

    const ci = new CI(this, 'CI', {
      repoName: 'stringsync',
      accountId: this.account,
    });

    const db = new rds.DatabaseInstance(this, 'Database', {
      vpc: network.vpc,
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
