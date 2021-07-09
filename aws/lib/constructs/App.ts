import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as cdk from '@aws-cdk/core';

type AppProps = {
  vpc: ec2.IVpc;
  appRepository: ecr.Repository;
  workerRepository: ecr.Repository;
  environment: Record<string, string>;
  secrets: Record<string, ecs.Secret>;
};

export class App extends cdk.Construct {
  readonly appService: ecs.FargateService;
  readonly workerService: ecs.FargateService;

  constructor(scope: cdk.Construct, id: string, props: AppProps) {
    super(scope, id);

    const cluster = new ecs.Cluster(this, 'Cluster', { vpc: props.vpc });

    const app = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'AppService', {
      cluster,
      desiredCount: 2,
      taskImageOptions: {
        containerName: 'app',
        image: ecs.ContainerImage.fromRegistry(props.appRepository.repositoryUri),
        enableLogging: true,
        environment: props.environment,
        secrets: props.secrets,
      },
    });
    this.appService = app.service;

    const worker = new ecsPatterns.QueueProcessingFargateService(this, 'WorkerService', {
      cluster,
      minScalingCapacity: 1,
      maxScalingCapacity: 1,
      image: ecs.ContainerImage.fromRegistry(props.workerRepository.repositoryUri),
      enableLogging: true,
      environment: props.environment,
      secrets: props.secrets,
    });
    this.workerService = worker.service;
  }
}
