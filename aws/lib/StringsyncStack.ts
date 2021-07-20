import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as rds from '@aws-cdk/aws-rds';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cfninc from '@aws-cdk/cloudformation-include';
import * as cdk from '@aws-cdk/core';
import { Cache } from './constructs/Cache';
import { CI } from './constructs/CI';

export class StringsyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appServiceTaskCount = new cdk.CfnParameter(this, 'AppServiceTaskCount', {
      type: 'Number',
      default: 0,
      description: 'The number of tasks to run the app service.',
    });

    const workerServiceTaskCount = new cdk.CfnParameter(this, 'WorkerServiceTaskCount', {
      type: 'Number',
      default: 0,
      description: 'The number of tasks to run the worker service.',
    });

    const domainName = new cdk.CfnParameter(this, 'DomainName', {
      type: 'String',
      description: 'The application naked domain name, e.g. example.com (not www.example.com)',
    });

    const vpc = new ec2.Vpc(this, 'VPC', {
      subnetConfiguration: [
        {
          name: 'Public',
          cidrMask: 24,
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'Isolated',
          cidrMask: 28,
          subnetType: ec2.SubnetType.ISOLATED,
        },
      ],
      natGateways: 0,
      maxAzs: 2,
    });

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
      vpc,
      databaseName: dbName,
      port: 5432,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromSecret(dbCredsSecret),
      vpcSubnets: {
        subnetType: ec2.SubnetType.ISOLATED,
      },
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_11 }),
    });

    const cache = new Cache(this, 'Cache', { vpc });

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
      vpc,
      allowAllOutbound: true,
    });

    const loadBalancer = new elbv2.ApplicationLoadBalancer(this, 'AppLoadBalancer', {
      vpc,
      securityGroup: loadBalancerSecurityGroup,
      internetFacing: true,
      deletionProtection: false,
    });

    const zone = new route53.HostedZone(this, 'Zone', {
      zoneName: domainName.valueAsString,
    });

    const appAliasRecord = new route53.ARecord(this, 'AppAliasRecord', {
      zone,
      recordName: domainName.valueAsString,
      target: route53.RecordTarget.fromAlias(new route53Targets.LoadBalancerTarget(loadBalancer)),
    });

    const publicListener = loadBalancer.addListener('PublicListener', {
      protocol: elbv2.ApplicationProtocol.HTTP,
    });

    const appTargetGroup = publicListener.addTargets('AppTargetGroup', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      healthCheck: {
        interval: cdk.Duration.seconds(30),
        path: '/health',
      },
    });

    const fargateContainerSecurityGroup = new ec2.SecurityGroup(this, 'FargateContainerSecurityGroup', {
      description: 'Access to the Fargate containers',
      vpc,
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
        origin: new origins.S3Origin(mediaBucket),
      },
    });

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc, containerInsights: true });

    const environment = {
      NODE_ENV: 'production',
      LOG_LEVEL: 'debug',
      PORT: '3000',
      WEB_UI_CDN_DOMAIN_NAME: webUiCdn.domainName,
      MEDIA_CDN_DOMAIN_NAME: mediaCdn.domainName,
      MEDIA_S3_BUCKET: mediaBucket.bucketName,
      VIDEO_SRC_S3_BUCKET: videoSourceBucketNameOutput.value,
      VIDEO_QUEUE_SQS_URL: sqsUrlOutput.value,
      DEV_EMAIL: 'dev@stringsync.com',
      INFO_EMAIL: 'info@stringsync.com',
      DB_HOST: db.instanceEndpoint.hostname,
      DB_PORT: '5432',
      DB_NAME: dbName,
      DB_USERNAME: dbCredsSecret.secretValueFromJson('username').toString(),
      DB_PASSWORD: dbCredsSecret.secretValueFromJson('password').toString(),
      REDIS_HOST: cache.cluster.attrRedisEndpointAddress,
      REDIS_PORT: cache.cluster.attrRedisEndpointPort,
    };

    const secrets = { SESSION_SECRET: ecs.Secret.fromSecretsManager(appSessionSecret) };

    const appTaskDefinition = new ecs.FargateTaskDefinition(this, 'AppTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    const appLogDriver = new ecs.AwsLogDriver({ streamPrefix: `${this.stackName}/app` });

    // Container health checks are not supported for tasks that are part of a service that
    // is configured to use a Classic Load Balancer.
    // https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_HealthCheck.html
    appTaskDefinition.addContainer('NginxContainer', {
      containerName: 'nginx',
      logging: appLogDriver,
      image: ecs.ContainerImage.fromRegistry(ci.nginxRepository.repositoryUri),
      portMappings: [{ containerPort: 80 }],
    });

    appTaskDefinition.addContainer('ApiContainer', {
      containerName: 'api',
      logging: appLogDriver,
      image: ecs.ContainerImage.fromRegistry(ci.apiRepository.repositoryUri),
      portMappings: [{ containerPort: 3000 }],
      environment,
      secrets,
    });

    const appService = new ecs.FargateService(this, 'AppService', {
      cluster,
      assignPublicIp: true,
      securityGroups: [fargateContainerSecurityGroup],
      taskDefinition: appTaskDefinition,
      desiredCount: appServiceTaskCount.valueAsNumber,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    });

    appTaskDefinition.executionRole?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')
    );

    appTargetGroup.addTarget(appService);

    const workerTaskDefinition = new ecs.FargateTaskDefinition(this, 'WorkerTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
    });

    const workerLogDriver = new ecs.AwsLogDriver({ streamPrefix: `${this.stackName}/worker` });

    workerTaskDefinition.addContainer('WorkerContainer', {
      containerName: 'worker',
      command: ['yarn', 'prod:worker'],
      logging: workerLogDriver,
      image: ecs.ContainerImage.fromRegistry(ci.workerRepository.repositoryUri),
      portMappings: [{ containerPort: 3000 }],
      healthCheck: {
        command: ['CMD-SHELL', 'curl --fail http://localhost:3000/health || exit 1'],
        interval: cdk.Duration.seconds(30),
      },
      environment,
      secrets,
    });

    const workerService = new ecs.FargateService(this, 'WorkerService', {
      cluster,
      assignPublicIp: true,
      securityGroups: [fargateContainerSecurityGroup],
      taskDefinition: workerTaskDefinition,
      desiredCount: workerServiceTaskCount.valueAsNumber,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    });

    workerTaskDefinition.executionRole?.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')
    );

    ci.pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipelineActions.EcsDeployAction({
          actionName: 'DeployApp',
          runOrder: 1,
          service: appService,
          imageFile: ci.appArtifactPath,
        }),
        new codepipelineActions.EcsDeployAction({
          actionName: 'DeployWorker',
          runOrder: 1,
          service: workerService,
          imageFile: ci.workerArtifactPath,
        }),
      ],
    });
  }
}
