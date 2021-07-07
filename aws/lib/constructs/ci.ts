import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecs from '@aws-cdk/aws-ecs';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

type CIProps = {
  repoName: string;
  accountId: string;
};

export class CI extends cdk.Construct {
  readonly appRepository: ecr.Repository;
  readonly workerRepository: ecr.Repository;
  readonly pipeline: codepipeline.Pipeline;

  private ecrBuildOutput: codepipeline.Artifact;

  constructor(scope: cdk.Construct, id: string, props: CIProps) {
    super(scope, id);

    const codeRepository = new codecommit.Repository(this, 'CodeRepository', {
      repositoryName: props.repoName,
    });

    this.appRepository = new ecr.Repository(this, 'AppRepository', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [
        {
          rulePriority: 1,
          description: 'Keep only one untagged image, expire all others',
          tagStatus: ecr.TagStatus.UNTAGGED,
          maxImageCount: 1,
        },
      ],
    });

    this.workerRepository = new ecr.Repository(this, 'WorkerRepository', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules: [
        {
          rulePriority: 1,
          description: 'Keep only one untagged image, expire all others',
          tagStatus: ecr.TagStatus.UNTAGGED,
          maxImageCount: 1,
        },
      ],
    });

    const ecrBuild = new codebuild.PipelineProject(this, 'EcrBuild', {
      timeout: cdk.Duration.minutes(30),
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER, codebuild.LocalCacheMode.CUSTOM),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        privileged: true,
        environmentVariables: {
          AWS_ACCOUNT_ID: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: props.accountId,
          },
          // https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.secrets-manager
          DOCKER_USERNAME: {
            type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
            value: 'DockerCreds:username',
          },
          DOCKER_PASSWORD: {
            type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
            value: 'DockerCreds:password',
          },
          CI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: 'true',
          },
          APP_REPO_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: this.appRepository.repositoryUri,
          },
          WORKER_REPO_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: this.workerRepository.repositoryUri,
          },
        },
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        cache: {
          paths: ['/root/.yarn/**/*/'],
        },
        phases: {
          install: {
            commands: ['yarn install'],
          },
          pre_build: {
            commands: [
              // https://docs.aws.amazon.com/codebuild/latest/userguide/sample-docker.html#sample-docker-files
              'aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com',
              'docker login --username $DOCKER_USERNAME --password $DOCKER_PASSWORD',
            ],
          },
          build: {
            commands: [
              './bin/ss builddocker',
              'docker tag stringsync:latest $APP_REPO_URI:latest',
              'DOCKERFILE=Dockerfile.worker DOCKER_TAG=stringsyncworker:latest ./bin/ss builddocker',
              'docker tag stringsyncworker:latest $WORKER_REPO_URI:latest',
              './bin/ss testall',
            ],
            'on-failure': 'ABORT',
          },
          post_build: {
            commands: [
              'docker push $APP_REPO_URI:latest',
              'docker push $WORKER_REPO_URI:latest',
              `printf '[{"name":"api","imageUri":"'$APP_REPO_URI'"}]' > imagedefinitions.api.json`,
              `printf '[{"name":"worker","imageUri":"'$WORKER_REPO_URI'"}]' > imagedefinitions.worker.json`,
              'mkdir imagedefinitions-artifacts',
            ],
          },
        },
        reports: {
          jest_reports: {
            'file-format': 'JUNITXML',
            'base-directory': 'reports',
            files: ['junit.web.xml', 'junit.api.xml'],
          },
        },
      }),
    });
    ecrBuild.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'ecr:BatchCheckLayerAvailability',
          'ecr:CompleteLayerUpload',
          'ecr:GetAuthorizationToken',
          'ecr:InitiateLayerUpload',
          'ecr:PutImage',
          'ecr:UploadLayerPart',
        ],
        // We must use '*' for ecr:GetAuthorizationToken
        resources: ['*'],
        effect: iam.Effect.ALLOW,
      })
    );

    const sourceOutput = new codepipeline.Artifact('SourceOutput');

    const ecrBuildOutput = new codepipeline.Artifact('BuildOutput');

    this.pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      restartExecutionOnUpdate: false,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipelineActions.CodeCommitSourceAction({
              actionName: 'GetSourceCode',
              branch: 'master',
              repository: codeRepository,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new codepipelineActions.CodeBuildAction({
              actionName: 'BuildImage',
              project: ecrBuild,
              input: sourceOutput,
              outputs: [ecrBuildOutput],
            }),
          ],
        },
      ],
    });
  }

  addDeployments(appService: ecs.IBaseService, workerService: ecs.IBaseService) {
    this.pipeline.addStage({
      stageName: 'Deploy',
      actions: [
        new codepipelineActions.EcsDeployAction({
          actionName: 'DeployApp',
          runOrder: 1,
          service: appService,
          input: this.ecrBuildOutput,
          imageFile: new codepipeline.ArtifactPath(this.ecrBuildOutput, 'imagedefinitions.api.json'),
        }),
        new codepipelineActions.EcsDeployAction({
          actionName: 'DeployWorker',
          runOrder: 1,
          service: workerService,
          input: this.ecrBuildOutput,
          imageFile: new codepipeline.ArtifactPath(this.ecrBuildOutput, 'imagedefinitions.worker.json'),
        }),
      ],
    });
  }
}
