import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as rds from '@aws-cdk/aws-rds';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
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

    const dbName = this.stackName;
    const dbCredsSecret = new secretsmanager.Secret(this, 'DbCreds', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'stringsync' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      },
    });
    const db = new rds.DatabaseInstance(this, 'Database', {
      vpc: network.vpc,
      databaseName: dbName,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromSecret(dbCredsSecret),
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE,
      },
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_11 }),
    });

    const cache = new Cache(this, 'Cache', {
      vpc: network.vpc,
    });

    if (APP_ENABLED) {
      const appSessionSecret = new secretsmanager.Secret(this, 'AppSessionSecret');

      const app = new App(this, 'App', {
        vpc: network.vpc,
        appRepository: ci.appRepository,
        workerRepository: ci.workerRepository,
        environment: {
          NODE_ENV: 'production',
          LOG_LEVEL: 'debug',
          PORT: '3000',
          WEB_UI_CDN_DOMAIN_NAME: '',
          MEDIA_CDN_DOMAIN_NAME: '',
          MEDIA_S3_BUCKET: '',
          VIDEO_SRC_S3_BUCKET: '',
          VIDEO_QUEUE_SQS_URL: '',
          DEV_EMAIL: 'dev@stringsync.com',
          INFO_EMAIL: 'info@stringsync.com',
          DB_HOST: db.instanceEndpoint.hostname,
          DB_PORT: db.instanceEndpoint.port.toString(),
          DB_NAME: dbName,
          DB_USERNAME: dbCredsSecret.secretValueFromJson('username').toString(),
          DB_PASSWORD: dbCredsSecret.secretValueFromJson('password').toString(),
          REDIS_HOST: cache.cluster.attrRedisEndpointAddress,
          REDIS_PORT: cache.cluster.attrRedisEndpointPort,
        },
        secrets: {
          SESSION_SECRET: ecs.Secret.fromSecretsManager(appSessionSecret),
        },
      });

      ci.addDeployments(app.appService, app.workerService);
    }
  }
}
