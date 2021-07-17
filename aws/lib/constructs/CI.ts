import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codecommit from '@aws-cdk/aws-codecommit';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';
import * as ecr from '@aws-cdk/aws-ecr';
import * as iam from '@aws-cdk/aws-iam';
import * as cdk from '@aws-cdk/core';

type CIProps = {
  repoName: string;
  accountId: string;
};

const APP_IMAGE_DEFINITION_FILE = 'imagedefinitions.app.json';
const DOCKER_CREDS_SECRET_NAME = 'DockerCreds';
const DOCKER_USERNAME = 'stringsync';

export class CI extends cdk.Construct {
  readonly apiRepository: ecr.Repository;
  readonly nginxRepository: ecr.Repository;
  readonly pipeline: codepipeline.Pipeline;
  readonly appArtifactPath: codepipeline.ArtifactPath;

  private ecrBuildOutput: codepipeline.Artifact;

  constructor(scope: cdk.Construct, id: string, props: CIProps) {
    super(scope, id);

    const codeRepository = new codecommit.Repository(this, 'CodeRepository', {
      repositoryName: props.repoName,
    });

    this.apiRepository = new ecr.Repository(this, 'ApiRepository', {
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

    this.nginxRepository = new ecr.Repository(this, 'NginxRepository', {
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
          // This is available in the DockerCreds secret under the 'username' key,
          // but it will filter anything that matches the username in the logs.
          // For this reason, we just leave it as plain text.
          DOCKER_USERNAME: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: DOCKER_USERNAME,
          },
          // https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.secrets-manager
          DOCKER_PASSWORD: {
            type: codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
            value: `${DOCKER_CREDS_SECRET_NAME}:password`,
          },
          CI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: 'true',
          },
          NGINX_REPO_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: this.nginxRepository.repositoryUri,
          },
          API_REPO_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: this.apiRepository.repositoryUri,
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
              '(docker pull $API_REPO_URI:latest && docker tag $API_REPO_URI:latest stringsync:latest) || true',
              '(docker pull $NGINX_REPO_URI:latest && docker tag $NGINX_REPO_URI:latest stringsyncnginx:latest) || true',
            ],
          },
          build: {
            commands: [
              './bin/ss buildapp',
              'docker tag stringsync:latest $API_REPO_URI:latest',
              './bin/ss buildnginx',
              'docker tag stringsyncnginx:latest $NGINX_REPO_URI:latest',
              './bin/ss testall',
            ],
            'on-failure': 'ABORT',
          },
          post_build: {
            commands: [
              'docker push $API_REPO_URI:latest',
              'docker push $NGINX_REPO_URI:latest',
              `printf '[{"name":"nginx","imageUri":"'$NGINX_REPO_URI'"}, {"name":"api","imageUri":"'$API_REPO_URI'"}]' > ${APP_IMAGE_DEFINITION_FILE}`,
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
        artifacts: {
          files: ['**/*'],
          'secondary-artifacts': {
            BuildOutput: {
              name: 'BuildOutput',
              'base-directory': 'imagedefinitions-artifacts',
              files: ['**/*'],
            },
          },
        },
      }),
    });
    ecrBuild.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'ecr:BatchGetImage',
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

    this.ecrBuildOutput = new codepipeline.Artifact('BuildOutput');

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
              outputs: [this.ecrBuildOutput],
            }),
          ],
        },
      ],
    });

    this.appArtifactPath = new codepipeline.ArtifactPath(this.ecrBuildOutput, APP_IMAGE_DEFINITION_FILE);
  }
}
