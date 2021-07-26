import * as cloudfront from '@aws-cdk/aws-cloudfront';
import * as origins from '@aws-cdk/aws-cloudfront-origins';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as elbv2 from '@aws-cdk/aws-elasticloadbalancingv2';
import * as iam from '@aws-cdk/aws-iam';
import * as route53 from '@aws-cdk/aws-route53';
import * as route53Targets from '@aws-cdk/aws-route53-targets';
import * as s3 from '@aws-cdk/aws-s3';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';
import { Cache } from './constructs/Cache';
import { CI } from './constructs/CI';
import { Db } from './constructs/Db';
import { Domain } from './constructs/Domain';
import { Vod } from './constructs/Vod';

export class StringsyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const appServiceTaskCount = new cdk.CfnParameter(this, 'AppServiceTaskCount', {
      type: 'Number',
      default: 0,
      description: 'The number of tasks to run the app service.',
    }).valueAsNumber;

    const workerServiceTaskCount = new cdk.CfnParameter(this, 'WorkerServiceTaskCount', {
      type: 'Number',
      default: 0,
      description: 'The number of tasks to run the worker service.',
    }).valueAsNumber;

    const domainName = new cdk.CfnParameter(this, 'DomainName', {
      type: 'String',
      description: 'The application naked domain name, e.g. example.com (not www.example.com).',
    }).valueAsString;

    const hostedZoneName = new cdk.CfnParameter(this, 'HostedZoneName', {
      type: 'String',
      description: 'The hosted zone name that the domain name is in',
    }).valueAsString;

    const hostedZoneId = new cdk.CfnParameter(this, 'HostedZoneId', {
      type: 'String',
      description: 'The hosted zone ID that the domain name is in',
    }).valueAsString;

    const vpc = new ec2.Vpc(this, 'VPC', {
      subnetConfiguration: [
        { name: 'Public', cidrMask: 24, subnetType: ec2.SubnetType.PUBLIC },
        { name: 'Isolated', cidrMask: 28, subnetType: ec2.SubnetType.ISOLATED },
      ],
      natGateways: 0,
      maxAzs: 2,
    });

    const domain = new Domain(this, 'Domain', {
      vpc,
      domainName,
      hostedZoneId,
      hostedZoneName,
      subdomainNames: ['www', 'media', 'lb'],
    });

    const ci = new CI(this, 'CI', { repoName: 'stringsync', accountId: this.account, domainName });

    const db = new Db(this, 'Db', {
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.ISOLATED },
      databaseName: this.stackName,
    });

    const cache = new Cache(this, 'Cache', { vpc });

    const vod = new Vod(this, 'Vod', {
      adminEmail: 'admin@stringsync.dev',
      enableAcceleratedTranscoding: false,
      enableSns: false,
    });

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

    const mediaCachePolicy = new cloudfront.CachePolicy(this, 'MediaCachePolicy', {
      defaultTtl: cdk.Duration.minutes(30),
      minTtl: cdk.Duration.minutes(30),
      maxTtl: cdk.Duration.minutes(60),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingGzip: true,
    });
    const mediaBucket = new s3.Bucket(this, 'MediaBucket', {
      autoDeleteObjects: false,
    });
    const mediaDistribution = new cloudfront.Distribution(this, 'MediaDistribution', {
      enabled: true,
      comment: 'Serves media',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      defaultBehavior: {
        origin: new origins.S3Origin(mediaBucket),
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: mediaCachePolicy,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [`media.${domainName}`],
      certificate: domain.certificate,
    });

    const loadBalancerOrigin = new origins.HttpOrigin(`lb.${domainName}`, {
      httpsPort: 443,
      protocolPolicy: cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
    });
    const appCachePolicy = new cloudfront.CachePolicy(this, 'AppCachePolicy', {
      defaultTtl: cdk.Duration.minutes(30),
      minTtl: cdk.Duration.minutes(30),
      maxTtl: cdk.Duration.minutes(60),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingGzip: true,
    });
    const doNotCachePolicy = new cloudfront.CachePolicy(this, 'DoNotCachePolicy', {
      defaultTtl: cdk.Duration.minutes(0),
      minTtl: cdk.Duration.minutes(0),
      maxTtl: cdk.Duration.minutes(0),
      cookieBehavior: cloudfront.CacheCookieBehavior.none(),
      headerBehavior: cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: cloudfront.CacheQueryStringBehavior.none(),
    });
    const forwardAllOriginRequestPolicy = new cloudfront.OriginRequestPolicy(this, 'FowardAllPolicy', {
      comment: 'Forwards all headers, cookies, and query string params to the origin',
      cookieBehavior: cloudfront.OriginRequestCookieBehavior.all(),
      headerBehavior: cloudfront.OriginRequestHeaderBehavior.all(),
      queryStringBehavior: cloudfront.OriginRequestQueryStringBehavior.all(),
    });
    const appDistribution = new cloudfront.Distribution(this, 'AppDistribution', {
      enabled: true,
      comment: 'Serves the application frontend',
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/' },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/' },
      ],
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: loadBalancerOrigin,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: appCachePolicy,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domain.domainName],
      certificate: domain.certificate,
    });
    appDistribution.addBehavior('/health', loadBalancerOrigin, {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: doNotCachePolicy,
    });
    appDistribution.addBehavior('/graphql', loadBalancerOrigin, {
      allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: doNotCachePolicy,
      originRequestPolicy: forwardAllOriginRequestPolicy,
    });

    const appWWWRedirectBucket = new s3.Bucket(this, 'AppWWWRedirectBucket', {
      autoDeleteObjects: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      websiteRedirect: {
        hostName: domain.domainName,
        protocol: s3.RedirectProtocol.HTTPS,
      },
    });
    const appWWWRedirectOrigin = new origins.S3Origin(appWWWRedirectBucket);
    const appWWWRedirectDistribution = new cloudfront.Distribution(this, 'AppWWWRedirectDistribution', {
      enabled: true,
      comment: 'Redirects www subdomain to the naked one',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_ALL,
      defaultBehavior: {
        origin: appWWWRedirectOrigin,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: doNotCachePolicy,
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domain.sub('www')],
      certificate: domain.certificate,
    });

    // Create targets and register them with the domain name and their respective subdomains.
    const loadBalancerTarget = route53.RecordTarget.fromAlias(new route53Targets.LoadBalancerTarget(loadBalancer));
    const appDistributionTarget = route53.RecordTarget.fromAlias(new route53Targets.CloudFrontTarget(appDistribution));
    const appWWWRedirectDistributionTarget = route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(appWWWRedirectDistribution)
    );
    const mediaDistributionTarget = route53.RecordTarget.fromAlias(
      new route53Targets.CloudFrontTarget(mediaDistribution)
    );
    domain.registerTarget(this, 'AliasRecord', {
      subdomain: '',
      target: appDistributionTarget,
    });
    domain.registerTarget(this, 'WWWAliasRecord', {
      subdomain: 'www',
      target: appWWWRedirectDistributionTarget,
    });
    domain.registerTarget(this, 'LBAliasRecord', {
      subdomain: 'lb',
      target: loadBalancerTarget,
    });
    domain.registerTarget(this, 'MediaAliasRecord', {
      subdomain: 'media',
      target: mediaDistributionTarget,
    });

    const publicHttpListener = loadBalancer.addListener('PublicHttpListener', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: 80,
      defaultAction: elbv2.ListenerAction.redirect({
        protocol: elbv2.ApplicationProtocol.HTTPS,
        port: '443',
        permanent: true,
      }),
    });
    const publicHttpsListener = loadBalancer.addListener('PublicHttpsListener', {
      protocol: elbv2.ApplicationProtocol.HTTPS,
      port: 443,
      certificates: [domain.certificate],
    });
    const appTargetGroup = publicHttpsListener.addTargets('AppTargetGroup', {
      protocol: elbv2.ApplicationProtocol.HTTP,
      port: 80,
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
    db.securityGroup.connections.allowFrom(fargateContainerSecurityGroup, ec2.Port.allTcp());

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc, containerInsights: true });

    const environment = {
      NODE_ENV: 'production',
      LOG_LEVEL: 'debug',
      PORT: '3000',
      DOMAIN_NAME: domainName,
      WEB_UI_CDN_DOMAIN_NAME: appDistribution.domainName,
      MEDIA_CDN_DOMAIN_NAME: mediaDistribution.domainName,
      MEDIA_S3_BUCKET: mediaBucket.bucketName,
      VIDEO_SRC_S3_BUCKET: vod.sourceBucket.bucketName,
      VIDEO_QUEUE_SQS_URL: vod.queue.queueUrl,
      DEV_EMAIL: 'dev@stringsync.com',
      INFO_EMAIL: 'info@stringsync.com',
      DB_HOST: db.hostname,
      DB_PORT: db.port,
      DB_NAME: db.databaseName,
      DB_USERNAME: db.username,
      DB_PASSWORD: db.password,
      REDIS_HOST: cache.cluster.attrRedisEndpointAddress,
      REDIS_PORT: cache.cluster.attrRedisEndpointPort,
    };

    const secrets = {
      SESSION_SECRET: ecs.Secret.fromSecretsManager(appSessionSecret),
    };

    const executionRole = new iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      roleName: cdk.PhysicalName.GENERATE_IF_NEEDED,
      managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')],
    });

    const migrateDbLogDriver = new ecs.AwsLogDriver({ streamPrefix: `${this.stackName}/migrateDb` });

    const migrateDbTaskDefinition = new ecs.FargateTaskDefinition(this, 'MigrateDbTaskDefintion', {
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole,
    });

    migrateDbTaskDefinition.addContainer('MigrateDbContainer', {
      containerName: 'migrate',
      command: ['yarn', 'migrate'],
      logging: migrateDbLogDriver,
      image: ecs.ContainerImage.fromRegistry(ci.apiRepository.repositoryUri),
      environment,
      secrets,
    });

    const appTaskDefinition = new ecs.FargateTaskDefinition(this, 'AppTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole,
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
      desiredCount: appServiceTaskCount,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    });

    appTargetGroup.addTarget(appService);

    const workerTaskDefinition = new ecs.FargateTaskDefinition(this, 'WorkerTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole,
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
      desiredCount: workerServiceTaskCount,
      platformVersion: ecs.FargatePlatformVersion.VERSION1_4,
    });

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
