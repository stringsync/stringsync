import {
  aws_cloudfront,
  aws_cloudfront_origins,
  aws_codepipeline_actions,
  aws_ec2,
  aws_ecs,
  aws_elasticloadbalancingv2,
  aws_events,
  aws_events_targets,
  aws_iam,
  aws_route53,
  aws_route53_targets,
  aws_s3,
  aws_secretsmanager,
  aws_sns,
  aws_sns_subscriptions,
  CfnParameter,
  Duration,
  PhysicalName,
  RemovalPolicy,
  Stack,
  StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { AdminInstance } from './constructs/AdminInstance';
import { Cache } from './constructs/Cache';
import { CI } from './constructs/CI';
import { Db } from './constructs/Db';
import { Domain } from './constructs/Domain';
import { Vod } from './constructs/Vod';

export class StringsyncStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    /**
     * PARAMETERS
     */

    const appServiceTaskCount = new CfnParameter(this, 'AppServiceTaskCount', {
      type: 'Number',
      default: 0,
      description: 'The number of tasks to run the app service.',
    }).valueAsNumber;

    const workerServiceTaskCount = new CfnParameter(this, 'WorkerServiceTaskCount', {
      type: 'Number',
      default: 0,
      description: 'The number of tasks to run the worker service.',
    }).valueAsNumber;

    const dispatcherServiceCount = new CfnParameter(this, 'DispatcherServiceTaskCount', {
      type: 'Number',
      default: 0,
      allowedValues: ['0', '1'],
      description: 'The number of tasks to run the dispatcher service.',
    }).valueAsNumber;

    const domainName = new CfnParameter(this, 'DomainName', {
      type: 'String',
      description: 'The application naked domain name, e.g. example.com (not www.example.com).',
    }).valueAsString;

    const hostedZoneName = new CfnParameter(this, 'HostedZoneName', {
      type: 'String',
      description: 'The hosted zone name that the domain name is in',
    }).valueAsString;

    const hostedZoneId = new CfnParameter(this, 'HostedZoneId', {
      type: 'String',
      description: 'The hosted zone ID that the domain name is in',
    }).valueAsString;

    /**
     * NETWORK
     */

    const vpc = new aws_ec2.Vpc(this, 'VPC', {
      subnetConfiguration: [
        { name: 'Public', cidrMask: 24, subnetType: aws_ec2.SubnetType.PUBLIC },
        { name: 'Isolated', cidrMask: 28, subnetType: aws_ec2.SubnetType.PRIVATE_ISOLATED },
      ],
      natGateways: 0,
      maxAzs: 2,
    });

    /**
     * CONSTRUCTS
     */

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
      vpcSubnets: { subnetType: aws_ec2.SubnetType.ISOLATED },
      databaseName: this.stackName,
    });

    const cache = new Cache(this, 'Cache', { vpc });

    const vod = new Vod(this, 'Vod', {
      adminEmail: 'admin@stringsync.com',
      enableAcceleratedTranscoding: false,
      enableSns: false,
    });

    const adminInstance = new AdminInstance(this, 'AdminInstance', { vpc });
    ci.codeRepository.grantPull(adminInstance.role);
    ci.codeRepository.grantRead(adminInstance.role);
    db.credsSecret.grantRead(adminInstance.role);
    adminInstance.role.addToPolicy(
      new aws_iam.PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        resources: [this.stackId],
        actions: ['cloudformation:DescribeStacks'],
      })
    );

    /**
     * SECURITY GROUPS
     */

    const appLoadBalancerSecurityGroup = new aws_ec2.SecurityGroup(this, 'AppLoadBalancerSecurityGroup', {
      description: 'Access to the app load balancer',
      vpc,
      allowAllOutbound: true,
    });
    const appContainerSecurityGroup = new aws_ec2.SecurityGroup(this, 'AppContainerSecurityGroup', {
      description: 'Access to the app docker containers',
      vpc,
    });
    appContainerSecurityGroup.connections.allowFrom(appLoadBalancerSecurityGroup, aws_ec2.Port.allTcp());
    cache.securityGroup.connections.allowFrom(appContainerSecurityGroup, aws_ec2.Port.allTcp());
    cache.securityGroup.connections.allowFrom(adminInstance.securityGroup, aws_ec2.Port.allTcp());
    db.securityGroup.connections.allowFrom(appContainerSecurityGroup, aws_ec2.Port.allTcp());
    db.securityGroup.connections.allowFrom(adminInstance.securityGroup, aws_ec2.Port.allTcp());

    /**
     * CLOUDFRONT CACHE POLICIES
     */

    const mediaCachePolicy = new aws_cloudfront.CachePolicy(this, 'MediaCachePolicy', {
      defaultTtl: Duration.minutes(30),
      minTtl: Duration.minutes(30),
      maxTtl: Duration.minutes(60),
      cookieBehavior: aws_cloudfront.CacheCookieBehavior.none(),
      headerBehavior: aws_cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: aws_cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingGzip: true,
    });

    const appCachePolicy = new aws_cloudfront.CachePolicy(this, 'AppCachePolicy', {
      defaultTtl: Duration.minutes(30),
      minTtl: Duration.minutes(30),
      maxTtl: Duration.minutes(60),
      cookieBehavior: aws_cloudfront.CacheCookieBehavior.none(),
      headerBehavior: aws_cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: aws_cloudfront.CacheQueryStringBehavior.none(),
      enableAcceptEncodingGzip: true,
    });

    const doNotCachePolicy = new aws_cloudfront.CachePolicy(this, 'DoNotCachePolicy', {
      defaultTtl: Duration.minutes(0),
      minTtl: Duration.minutes(0),
      maxTtl: Duration.minutes(0),
      cookieBehavior: aws_cloudfront.CacheCookieBehavior.none(),
      headerBehavior: aws_cloudfront.CacheHeaderBehavior.none(),
      queryStringBehavior: aws_cloudfront.CacheQueryStringBehavior.none(),
    });

    /**
     * ORIGIN REQUEST POLICIES
     */

    const forwardAllOriginRequestPolicy = new aws_cloudfront.OriginRequestPolicy(this, 'FowardAllPolicy', {
      comment: 'Forwards all headers, cookies, and query string params to the origin',
      cookieBehavior: aws_cloudfront.OriginRequestCookieBehavior.all(),
      headerBehavior: aws_cloudfront.OriginRequestHeaderBehavior.all(),
      queryStringBehavior: aws_cloudfront.OriginRequestQueryStringBehavior.all(),
    });

    /**
     * MEDIA RESOURCES
     */

    const mediaBucket = new aws_s3.Bucket(this, 'MediaBucket', {
      autoDeleteObjects: false,
      cors: [
        {
          allowedMethods: [aws_s3.HttpMethods.GET],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
    });

    const mediaDistribution = new aws_cloudfront.Distribution(this, 'MediaDistribution', {
      enabled: true,
      comment: 'Serves media from the prod media bucket',
      priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_ALL,
      defaultBehavior: {
        origin: new aws_cloudfront_origins.S3Origin(mediaBucket),
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: mediaCachePolicy,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domain.sub('media')],
      certificate: domain.certificate,
    });

    /**
     * APP RESOURCES
     */

    const appLoadBalancer = new aws_elasticloadbalancingv2.ApplicationLoadBalancer(this, 'AppLoadBalancer', {
      vpc,
      securityGroup: appLoadBalancerSecurityGroup,
      internetFacing: true,
      deletionProtection: false,
    });
    const appLoadBalancerOrigin = new aws_cloudfront_origins.HttpOrigin(domain.sub('lb'), {
      httpsPort: 443,
      protocolPolicy: aws_cloudfront.OriginProtocolPolicy.HTTPS_ONLY,
    });
    const appDistribution = new aws_cloudfront.Distribution(this, 'AppDistribution', {
      enabled: true,
      comment: 'Serves the prod application frontend',
      errorResponses: [
        { httpStatus: 403, responseHttpStatus: 200, responsePagePath: '/' },
        { httpStatus: 404, responseHttpStatus: 200, responsePagePath: '/' },
      ],
      priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_ALL,
      defaultRootObject: 'index.html',
      defaultBehavior: {
        origin: appLoadBalancerOrigin,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: appCachePolicy,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domain.domainName],
      certificate: domain.certificate,
    });
    appDistribution.addBehavior('/health', appLoadBalancerOrigin, {
      allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: doNotCachePolicy,
    });
    appDistribution.addBehavior('/graphql', appLoadBalancerOrigin, {
      allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_ALL,
      cachePolicy: doNotCachePolicy,
      originRequestPolicy: forwardAllOriginRequestPolicy,
    });
    const appHttpListener = appLoadBalancer.addListener('AppHttpListener', {
      protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
      port: 80,
      defaultAction: aws_elasticloadbalancingv2.ListenerAction.redirect({
        protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTPS,
        port: '443',
        permanent: true,
      }),
    });
    const appHttpsListener = appLoadBalancer.addListener('AppHttpsListener', {
      protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTPS,
      port: 443,
      certificates: [domain.certificate],
    });
    const appTargetGroup = appHttpsListener.addTargets('AppTargetGroup', {
      protocol: aws_elasticloadbalancingv2.ApplicationProtocol.HTTP,
      port: 80,
      healthCheck: {
        interval: Duration.seconds(30),
        path: '/health',
      },
    });

    /**
     * APP WWW REDIRECT RESOURCES
     */

    const appWWWRedirectBucket = new aws_s3.Bucket(this, 'AppWWWRedirectBucket', {
      autoDeleteObjects: true,
      removalPolicy: RemovalPolicy.DESTROY,
      websiteRedirect: {
        hostName: domain.domainName,
        protocol: aws_s3.RedirectProtocol.HTTPS,
      },
    });
    const appWWWRedirectOrigin = new aws_cloudfront_origins.S3Origin(appWWWRedirectBucket);
    const appWWWRedirectDistribution = new aws_cloudfront.Distribution(this, 'AppWWWRedirectDistribution', {
      enabled: true,
      comment: 'Redirects www subdomain to the naked one',
      priceClass: aws_cloudfront.PriceClass.PRICE_CLASS_ALL,
      defaultBehavior: {
        origin: appWWWRedirectOrigin,
        allowedMethods: aws_cloudfront.AllowedMethods.ALLOW_GET_HEAD_OPTIONS,
        cachePolicy: doNotCachePolicy,
        viewerProtocolPolicy: aws_cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      domainNames: [domain.sub('www')],
      certificate: domain.certificate,
    });

    /**
     * RECORD REGISTRATION
     */

    const loadBalancerTarget = aws_route53.RecordTarget.fromAlias(
      new aws_route53_targets.LoadBalancerTarget(appLoadBalancer)
    );
    const appDistributionTarget = aws_route53.RecordTarget.fromAlias(
      new aws_route53_targets.CloudFrontTarget(appDistribution)
    );
    const appWWWRedirectDistributionTarget = aws_route53.RecordTarget.fromAlias(
      new aws_route53_targets.CloudFrontTarget(appWWWRedirectDistribution)
    );
    const mediaDistributionTarget = aws_route53.RecordTarget.fromAlias(
      new aws_route53_targets.CloudFrontTarget(mediaDistribution)
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

    /**
     * ECS ENVIRONMENT
     */

    const cluster = new aws_ecs.Cluster(this, 'Cluster', { vpc, containerInsights: true });

    const environment = {
      NODE_ENV: 'production',
      LOG_LEVEL: 'debug',
      PORT: '3000',
      DOMAIN_NAME: domainName,
      WEB_UI_CDN_DOMAIN_NAME: appDistribution.domainName,
      MEDIA_CDN_DOMAIN_NAME: `https://${domain.sub('media')}`,
      MEDIA_S3_BUCKET: mediaBucket.bucketName,
      VIDEO_SRC_S3_BUCKET: vod.sourceBucket.bucketName,
      VIDEO_QUEUE_SQS_URL: vod.queue.queueUrl,
      DEV_EMAIL: 'dev@stringsync.com',
      INFO_EMAIL: 'info@stringsync.com',
      DB_HOST: db.hostname,
      DB_PORT: db.port.toString(),
      DB_NAME: db.databaseName,
      DB_USERNAME: db.username,
      DB_PASSWORD: db.password,
      REDIS_HOST: cache.host,
      REDIS_PORT: cache.port.toString(),
    };

    const appSessionSecret = new aws_secretsmanager.Secret(this, 'AppSessionSecret');

    const secrets = {
      SESSION_SECRET: aws_ecs.Secret.fromSecretsManager(appSessionSecret),
    };

    const taskExecutionRole = new aws_iam.Role(this, 'TaskExecutionRole', {
      assumedBy: new aws_iam.ServicePrincipal('ecs-tasks.amazonaws.com'),
      roleName: PhysicalName.GENERATE_IF_NEEDED,
      managedPolicies: [aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonEC2ContainerRegistryPowerUser')],
    });

    /**
     * APP TASK DEFINITION
     */

    const appLogDriver = new aws_ecs.AwsLogDriver({ streamPrefix: `${this.stackName}/app` });
    const appTaskDefinition = new aws_ecs.FargateTaskDefinition(this, 'AppTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole: taskExecutionRole,
    });
    mediaBucket.grantReadWrite(appTaskDefinition.taskRole);
    vod.sourceBucket.grantReadWrite(appTaskDefinition.taskRole);

    // Container health checks are not supported for tasks that are part of a service that
    // is configured to use a Classic Load Balancer.
    // https://docs.aws.amazon.com/AmazonECS/latest/APIReference/API_HealthCheck.html
    appTaskDefinition.addContainer('NginxContainer', {
      containerName: 'nginx',
      logging: appLogDriver,
      image: aws_ecs.ContainerImage.fromRegistry(ci.nginxRepository.repositoryUri),
      portMappings: [{ containerPort: 80 }],
    });
    appTaskDefinition.addContainer('ApiContainer', {
      containerName: 'api',
      logging: appLogDriver,
      image: aws_ecs.ContainerImage.fromRegistry(ci.apiRepository.repositoryUri),
      portMappings: [{ containerPort: 3000 }],
      environment,
      secrets,
    });

    /**
     * DISPATCHER TASK DEFINITION
     */

    const dispatcherLogDriver = new aws_ecs.AwsLogDriver({ streamPrefix: `${this.stackName}/dispatcher` });
    const dispatcherTaskDefinition = new aws_ecs.FargateTaskDefinition(this, 'DispatcherTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole: taskExecutionRole,
    });
    dispatcherTaskDefinition.addContainer('DispatcherContainer', {
      containerName: 'dispatcher',
      command: ['yarn', 'prod:dispatcher'],
      logging: dispatcherLogDriver,
      image: aws_ecs.ContainerImage.fromRegistry(ci.workerRepository.repositoryUri),
      portMappings: [{ containerPort: 3000 }],
      healthCheck: {
        command: ['CMD-SHELL', 'curl --fail http://localhost:3000/health || exit 1'],
        interval: Duration.seconds(30),
      },
      environment,
      secrets,
    });

    /**
     * WORKER TASK DEFINITION
     */

    const workerLogDriver = new aws_ecs.AwsLogDriver({ streamPrefix: `${this.stackName}/worker` });
    const workerTaskDefinition = new aws_ecs.FargateTaskDefinition(this, 'WorkerTaskDefinition', {
      cpu: 256,
      memoryLimitMiB: 512,
      executionRole: taskExecutionRole,
    });
    workerTaskDefinition.addContainer('WorkerContainer', {
      containerName: 'worker',
      command: ['yarn', 'prod:worker'],
      logging: workerLogDriver,
      image: aws_ecs.ContainerImage.fromRegistry(ci.workerRepository.repositoryUri),
      portMappings: [{ containerPort: 3000 }],
      healthCheck: {
        command: ['CMD-SHELL', 'curl --fail http://localhost:3000/health || exit 1'],
        interval: Duration.seconds(30),
      },
      environment,
      secrets,
    });
    workerTaskDefinition.taskRole.addToPrincipalPolicy(
      new aws_iam.PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: ['ses:SendRawEmail'],
        resources: ['*'],
      })
    );
    vod.queue.grantConsumeMessages(workerTaskDefinition.taskRole);

    /**
     * SERVICES
     */

    const appService = new aws_ecs.FargateService(this, 'AppService', {
      cluster,
      assignPublicIp: true,
      securityGroups: [appContainerSecurityGroup],
      taskDefinition: appTaskDefinition,
      desiredCount: appServiceTaskCount,
      platformVersion: aws_ecs.FargatePlatformVersion.VERSION1_4,
    });
    appTargetGroup.addTarget(appService);

    const dispatcherService = new aws_ecs.FargateService(this, 'DispatcherService', {
      cluster,
      assignPublicIp: true,
      securityGroups: [appContainerSecurityGroup],
      taskDefinition: dispatcherTaskDefinition,
      desiredCount: dispatcherServiceCount,
      platformVersion: aws_ecs.FargatePlatformVersion.VERSION1_4,
    });

    const workerService = new aws_ecs.FargateService(this, 'WorkerService', {
      cluster,
      assignPublicIp: true,
      securityGroups: [appContainerSecurityGroup],
      taskDefinition: workerTaskDefinition,
      desiredCount: workerServiceTaskCount,
      platformVersion: aws_ecs.FargatePlatformVersion.VERSION1_4,
    });

    /**
     * CI DEPLOYMENT STAGE SPEC
     */

    ci.pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new aws_codepipeline_actions.EcsDeployAction({
          actionName: 'DeployApp',
          runOrder: 1,
          service: appService,
          imageFile: ci.appArtifactPath,
        }),
        new aws_codepipeline_actions.EcsDeployAction({
          actionName: 'DeployDispatcher',
          runOrder: 1,
          service: dispatcherService,
          imageFile: ci.dispatcherArtifactPath,
        }),
        new aws_codepipeline_actions.EcsDeployAction({
          actionName: 'DeployWorker',
          runOrder: 1,
          service: workerService,
          imageFile: ci.workerArtifactPath,
        }),
      ],
    });

    /**
     * CI NOTIFICATIONS
     * https://github.com/stelligent/cloudformation_templates/blob/74addde798e276adb45ec9f1487f4a5e2f58cabb/labs/codepipeline/codepipeline-notifications.yml
     */
    const adminEmailTopic = new aws_sns.Topic(this, 'AdminEmailTopic');
    adminEmailTopic.addSubscription(new aws_sns_subscriptions.EmailSubscription('admin@stringsync.com'));

    new aws_events.Rule(this, 'CodePipelineEvents', {
      description: 'Notifies the admin when a deployment failed or succeeded',
      eventPattern: {
        source: ['aws.codepipeline'],
        detailType: ['CodePipeline Pipeline Execution State Change'],
        detail: { state: ['FAILED', 'SUCCEEDED'] },
      },
      targets: [new aws_events_targets.SnsTopic(adminEmailTopic)],
    });
  }
}
