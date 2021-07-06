import * as cdk from '@aws-cdk/core';
import { App } from './constructs/app';
import { CI } from './constructs/ci';
import { Network } from './constructs/network';

export class AppStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const network = new Network(this, 'Network');

    const ci = new CI(this, 'CI', {
      repoName: 'stringsync',
    });

    const app = new App(this, 'App', {
      vpc: network.vpc,
      appRepository: ci.appRepository,
      workerRepository: ci.workerRepository,
    });
  }
}
