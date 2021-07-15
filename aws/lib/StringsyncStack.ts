import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as rds from '@aws-cdk/aws-rds';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cfninc from '@aws-cdk/cloudformation-include';
import * as cdk from '@aws-cdk/core';
import { Cache } from './constructs/Cache';
import { CI } from './constructs/CI';
import { Network } from './constructs/Network';

const APP_ENABLED = true;

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
      const vodTemplate = new cfninc.CfnInclude(this, 'VodTemplate', {
        templateFile: 'templates/vod.yml',
        preserveLogicalIds: true,
        parameters: {
          AdminEmail: 'jared@jaredjohnson.dev',
          EnableSns: 'No',
          AcceleratedTranscoding: 'DISABLED',
        },
      });

      const videoSourceBucketNameOutput = vodTemplate.getOutput('Source');

      const sqsUrlOutput = vodTemplate.getOutput('SqsURL');

      const appSessionSecret = new secretsmanager.Secret(this, 'AppSessionSecret');

      const loadBalancerSecurityGroup = new ec2.SecurityGroup(this, 'LoadBalancerSecurityGroup', {
        vpc: network.vpc,
        allowAllOutbound: true,
      });

      // Cast to any since the cloudfront ec2 reference is stale.
      // For example, Type 'import("/Users/jared/Projects/stringsync/aws/node_modules/@aws-cdk/aws-ec2/lib/vpc").ISubnet[]'
      // is not assignable to type 'import("/Users/jared/Projects/stringsync/aws/node_modules/@aws-cdk/aws-cloudfront/node_modules/@aws-cdk/aws-ec2/lib/vpc").ISubnet[]'.
      const loadBalancer = new (elbv2.ApplicationLoadBalancer as any)(this, 'AppLoadBalancer', {
        vpc: network.vpc,
        securityGroup: loadBalancerSecurityGroup,
        internetFacing: true,
        deletionProtection: false,
      });

      const fargateContainerSecurityGroup = new ec2.SecurityGroup(this, 'FargateContainerSecurityGroup', {
        description: 'Access to the Fargate containers',
        vpc: network.vpc,
      });
      fargateContainerSecurityGroup.connections.allowFrom(loadBalancerSecurityGroup, ec2.Port.allTcp());

      cache.securityGroup.connections.allowFrom(fargateContainerSecurityGroup, ec2.Port.allTcp());

      const webUiCdn = new cloudfront.Distribution(this, 'WebUiCdn', {
        enabled: true,
        comment: 'Serves the web ui',
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        defaultBehavior: {
          origin: new origins.LoadBalancerV2Origin(loadBalancer),
        },
        errorResponses: [
          {
            httpStatus: 403,
            responseHttpStatus: 200,
            responsePagePath: '/',
          },
          {
            httpStatus: 404,
            responseHttpStatus: 200,
            responsePagePath: '/',
          },
        ],
      });

      const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
        autoDeleteObjects: false,
      });

      const mediaCdn = new cloudfront.Distribution(this, 'MediaCdn', {
        enabled: true,
        comment: 'Serves media saved in the media bucket',
        priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
        defaultBehavior: {
          // Cast to any since the cloudfront-origins ec2 reference is stale.
          origin: new (origins.S3Origin as any)(mediaBucket),
        },
      });

      const cluster = new ecs.Cluster(this, 'Cluster', { vpc: network.vpc });

      const environment = {
        NODE_ENV: 'production',
        LOG_LEVEL: 'debug',
        PORT: '80',
        WEB_UI_CDN_DOMAIN_NAME: webUiCdn.domainName,
        MEDIA_CDN_DOMAIN_NAME: mediaCdn.domainName,
        MEDIA_S3_BUCKET: mediaBucket.bucketName,
        VIDEO_SRC_S3_BUCKET: videoSourceBucketNameOutput.toString(),
        VIDEO_QUEUE_SQS_URL: sqsUrlOutput.toString(),
        DEV_EMAIL: 'dev@stringsync.com',
        INFO_EMAIL: 'info@stringsync.com',
        DB_HOST: db.instanceEndpoint.hostname,
        DB_PORT: db.instanceEndpoint.port.toString(),
        DB_NAME: dbName,
        DB_USERNAME: dbCredsSecret.secretValueFromJson('username').toString(),
        DB_PASSWORD: dbCredsSecret.secretValueFromJson('password').toString(),
        REDIS_HOST: cache.cluster.attrRedisEndpointAddress,
        REDIS_PORT: cache.cluster.attrRedisEndpointPort,
      };

      const secrets = { SESSION_SECRET: ecs.Secret.fromSecretsManager(appSessionSecret) };

      const app = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'AppService', {
        cluster,
        assignPublicIp: true,
        taskSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        securityGroups: [fargateContainerSecurityGroup],
        desiredCount: 1,
        loadBalancer,
        loadBalancerName: 'AppLoaderBalancer',
        taskImageOptions: {
          containerName: 'app',
          image: ecs.ContainerImage.fromRegistry(ci.appRepository.repositoryUri),
          enableLogging: true,
          environment,
          secrets,
          containerPort: 80,
        },
      });

      app.taskDefinition.executionRole?.addManagedPolicy(
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')
      );

      app.targetGroup.configureHealthCheck({
        path: '/health',
        port: '80',
      });

      // const worker = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'WorkerService', {
      //   cluster,
      //   desiredCount: 1,
      //   loadBalancer,
      //   loadBalancerName: 'WorkerLoaderBalancer',
      //   taskImageOptions: {
      //     containerName: 'worker',
      //     image: ecs.ContainerImage.fromRegistry(ci.workerRepository.repositoryUri),
      //     enableLogging: true,
      //     environment,
      //     secrets,
      //   },
      // });

      ci.addDeployments(app.service);
    }
  }
}
