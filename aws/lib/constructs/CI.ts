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
  domainName: string;
};

const APP_IMAGE_DEFINITION_FILE = 'imagedefinitions.app.json';
const WORKER_IMAGE_DEFINITION_FILE = 'imagedefinitions.worker.json';
const DOCKER_CREDS_SECRET_NAME = 'DockerCreds';
const DOCKER_USERNAME = 'stringsync';

export class CI extends cdk.Construct {
  readonly apiRepository: ecr.Repository;
  readonly nginxRepository: ecr.Repository;
  readonly workerRepository: ecr.Repository;
  readonly pipeline: codepipeline.Pipeline;
  readonly appArtifactPath: codepipeline.ArtifactPath;
  readonly workerArtifactPath: codepipeline.ArtifactPath;

  private buildOutput: codepipeline.Artifact;

  constructor(scope: cdk.Construct, id: string, props: CIProps) {
    super(scope, id);

    const codeRepository = new codecommit.Repository(this, 'CodeRepository', {
      repositoryName: props.repoName,
    });

    const lifecycleRules: ecr.LifecycleRule[] = [
      {
        rulePriority: 1,
        description: 'Keep only one untagged image, expire all others',
        tagStatus: ecr.TagStatus.UNTAGGED,
        maxImageCount: 1,
      },
    ];

    this.apiRepository = new ecr.Repository(this, 'ApiRepository', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules,
    });

    this.nginxRepository = new ecr.Repository(this, 'NginxRepository', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules,
    });

    this.workerRepository = new ecr.Repository(this, 'WorkerRepository', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      lifecycleRules,
    });

    const ecrBuild = new codebuild.PipelineProject(this, 'EcrBuild', {
      timeout: cdk.Duration.minutes(30),
      cache: codebuild.Cache.local(codebuild.LocalCacheMode.DOCKER_LAYER, codebuild.LocalCacheMode.CUSTOM),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: codebuild.ComputeType.MEDIUM,
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
          WORKER_REPO_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: this.workerRepository.repositoryUri,
          },
          REACT_APP_API_URI: {
            type: codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: `https://${props.domainName}`,
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
            commands: [
              'yarn install',
              'yarn --cwd web',
              // Install puppeteer dependencies
              'apt-get update',
              'apt-get install -yq gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget',
            ],
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
              // NB: The api image also runs the workers!
              'docker tag stringsync:latest $WORKER_REPO_URI:latest',
              './bin/ss buildnginx',
              'docker tag stringsyncnginx:latest $NGINX_REPO_URI:latest',
              './bin/ss testall',
            ],
            finally: ['./bin/ss extractreports'],
            'on-failure': 'ABORT',
          },
          post_build: {
            commands: [
              'docker push $API_REPO_URI:latest',
              'docker push $NGINX_REPO_URI:latest',
              'docker push $WORKER_REPO_URI:latest',
              `printf '[{"name":"nginx","imageUri":"'$NGINX_REPO_URI'"}, {"name":"api","imageUri":"'$API_REPO_URI'"}]' > ${APP_IMAGE_DEFINITION_FILE}`,
              `printf '[{"name":"worker","imageUri":"'$WORKER_REPO_URI'"}]' > ${WORKER_IMAGE_DEFINITION_FILE}`,
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
          files: [APP_IMAGE_DEFINITION_FILE, WORKER_IMAGE_DEFINITION_FILE],
        },
      }),
    });
    ecrBuild.addToRolePolicy(
      new iam.PolicyStatement({
        actions: [
          'ecr:BatchGetImage',
          'ecr:GetDownloadUrlForLayer',
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

    this.buildOutput = new codepipeline.Artifact('BuildOutput');

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
              outputs: [this.buildOutput],
            }),
          ],
        },
      ],
    });

    this.appArtifactPath = this.buildOutput.atPath(APP_IMAGE_DEFINITION_FILE);
    this.workerArtifactPath = this.buildOutput.atPath(WORKER_IMAGE_DEFINITION_FILE);
  }
}
