import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as ecr from '@aws-cdk/aws-ecr';
import * as cdk from '@aws-cdk/core';

type CIProps = {
  repoName: string;
};

export class CI extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: CIProps) {
    super(scope, id);

    const codeRepository = new codecommit.Repository(this, 'CodeRepository', {
      repositoryName: props.repoName,
    });

    const imageRepository = new ecr.Repository(this, 'ImageRepository', {
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
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        privileged: true,
        environmentVariables: {
          CI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: 'true',
          },
          IMAGE_REPO_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: imageRepository.repositoryUri,
          },
        },
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          install: {
            commands: ['yarn install'],
          },
          pre_build: {
            commands: ['$(aws ecr get-login --no-include-email --region $AWS_DEFAULT_REGION)'],
          },
          build: {
            commands: ['./bin/ss builddocker', 'docker tag stringsync:latest $IMAGE_URI:latest', './bin/ss testall'],
            'on-failure': 'ABORT',
          },
          postBuild: {
            commands: ['docker push $IMAGE_URI:latest'],
          },
        },
      }),
    });

    const sourceOutput = new codepipeline.Artifact('SourceOutput');

    const ecrBuildOutput = new codepipeline.Artifact('EcrBuildOutput');

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      restartExecutionOnUpdate: false,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new codepipelineActions.CodeCommitSourceAction({
              actionName: 'CodeCommit_Source',
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
              actionName: 'ECR_Build',
              project: ecrBuild,
              input: sourceOutput,
              outputs: [ecrBuildOutput],
            }),
          ],
        },
      ],
    });
  }
}
