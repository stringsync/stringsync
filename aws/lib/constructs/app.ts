import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as cdk from '@aws-cdk/core';

type AppProps = {
  vpc: ec2.IVpc;
  appRepository: ecr.Repository;
  workerRepository: ecr.Repository;
};

export class App extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: AppProps) {
    super(scope, id);

    const appCluster = new ecs.Cluster(this, 'AppCluster', { vpc: props.vpc });
    const appService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'AppService', {
      cluster: appCluster,
      desiredCount: 2,
      taskImageOptions: {
        containerName: 'app',
        image: ecs.ContainerImage.fromRegistry(props.appRepository.repositoryUri),
        enableLogging: true,
        environment: {},
      },
    });

    const workerCluster = new ecs.Cluster(this, 'WorkerCluster', { vpc: props.vpc });
    const workerService = new ecsPatterns.QueueProcessingFargateService(this, 'WorkerService', {
      cluster: workerCluster,
      maxScalingCapacity: 2,
      image: ecs.ContainerImage.fromRegistry(props.workerRepository.repositoryUri),
      enableLogging: true,
      environment: {},
    });
  }
}
