import {
  aws_codebuild,
  aws_codecommit,
  aws_codepipeline,
  aws_codepipeline_actions,
  aws_ecr,
  aws_iam,
  Duration,
  RemovalPolicy,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';

type CIProps = {
  repoName: string;
  accountId: string;
  domainName: string;
};

const APP_IMAGE_DEFINITION_FILE = 'imagedefinitions.app.json';
const WORKER_IMAGE_DEFINITION_FILE = 'imagedefinitions.worker.json';
const DISPATCHER_IMAGE_DEFINITION_FILE = 'imagedefinitions.dispatcher.json';
const DOCKER_CREDS_SECRET_NAME = 'DockerCreds';
const DOCKER_USERNAME = 'stringsync';

export class CI extends Construct {
  readonly codeRepository: aws_codecommit.Repository;
  readonly apiRepository: aws_ecr.Repository;
  readonly nginxRepository: aws_ecr.Repository;
  readonly workerRepository: aws_ecr.Repository;
  readonly pipeline: aws_codepipeline.Pipeline;
  readonly appArtifactPath: aws_codepipeline.ArtifactPath;
  readonly workerArtifactPath: aws_codepipeline.ArtifactPath;
  readonly dispatcherArtifactPath: aws_codepipeline.ArtifactPath;

  private buildOutput: aws_codepipeline.Artifact;

  constructor(scope: Construct, id: string, props: CIProps) {
    super(scope, id);

    this.codeRepository = new aws_codecommit.Repository(this, 'CodeRepository', {
      repositoryName: props.repoName,
    });

    const lifecycleRules: aws_ecr.LifecycleRule[] = [
      {
        rulePriority: 1,
        description: 'Keep only one untagged image, expire all others',
        tagStatus: aws_ecr.TagStatus.UNTAGGED,
        maxImageCount: 1,
      },
    ];

    this.apiRepository = new aws_ecr.Repository(this, 'ApiRepository', {
      removalPolicy: RemovalPolicy.DESTROY,
      lifecycleRules,
    });

    this.nginxRepository = new aws_ecr.Repository(this, 'NginxRepository', {
      removalPolicy: RemovalPolicy.DESTROY,
      lifecycleRules,
    });

    this.workerRepository = new aws_ecr.Repository(this, 'WorkerRepository', {
      removalPolicy: RemovalPolicy.DESTROY,
      lifecycleRules,
    });

    const ecrBuild = new aws_codebuild.PipelineProject(this, 'EcrBuild', {
      timeout: Duration.minutes(30),
      cache: aws_codebuild.Cache.local(aws_codebuild.LocalCacheMode.DOCKER_LAYER, aws_codebuild.LocalCacheMode.CUSTOM),
      environment: {
        buildImage: aws_codebuild.LinuxBuildImage.STANDARD_5_0,
        computeType: aws_codebuild.ComputeType.MEDIUM,
        privileged: true,
        environmentVariables: {
          AWS_ACCOUNT_ID: {
            type: aws_codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: props.accountId,
          },
          // This is available in the DockerCreds secret under the 'username' key,
          // but it will filter anything that matches the username in the logs.
          // For this reason, we just leave it as plain text.
          DOCKER_USERNAME: {
            type: aws_codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: DOCKER_USERNAME,
          },
          // https://docs.aws.amazon.com/codebuild/latest/userguide/build-spec-ref.html#build-spec.env.secrets-manager
          DOCKER_PASSWORD: {
            type: aws_codebuild.BuildEnvironmentVariableType.SECRETS_MANAGER,
            value: `${DOCKER_CREDS_SECRET_NAME}:password`,
          },
          CI: {
            type: aws_codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: 'true',
          },
          NGINX_REPO_URI: {
            type: aws_codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: this.nginxRepository.repositoryUri,
          },
          API_REPO_URI: {
            type: aws_codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: this.apiRepository.repositoryUri,
          },
          WORKER_REPO_URI: {
            type: aws_codebuild.BuildEnvironmentVariableType.PLAINTEXT,
            value: this.workerRepository.repositoryUri,
          },
        },
      },
      buildSpec: aws_codebuild.BuildSpec.fromObject({
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
              `printf '[{"name":"dispatcher","imageUri":"'$WORKER_REPO_URI'"}]' > ${DISPATCHER_IMAGE_DEFINITION_FILE}`,
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
          files: [APP_IMAGE_DEFINITION_FILE, DISPATCHER_IMAGE_DEFINITION_FILE, WORKER_IMAGE_DEFINITION_FILE],
        },
      }),
    });
    ecrBuild.addToRolePolicy(
      new aws_iam.PolicyStatement({
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
        effect: aws_iam.Effect.ALLOW,
      })
    );

    const sourceOutput = new aws_codepipeline.Artifact('SourceOutput');

    this.buildOutput = new aws_codepipeline.Artifact('BuildOutput');

    this.pipeline = new aws_codepipeline.Pipeline(this, 'Pipeline', {
      restartExecutionOnUpdate: false,
      stages: [
        {
          stageName: 'Source',
          actions: [
            new aws_codepipeline_actions.CodeCommitSourceAction({
              actionName: 'GetSourceCode',
              branch: 'master',
              repository: this.codeRepository,
              output: sourceOutput,
            }),
          ],
        },
        {
          stageName: 'Build',
          actions: [
            new aws_codepipeline_actions.CodeBuildAction({
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
    this.dispatcherArtifactPath = this.buildOutput.atPath(DISPATCHER_IMAGE_DEFINITION_FILE);
  }
}
