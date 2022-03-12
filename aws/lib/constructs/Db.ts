import { aws_ec2, aws_rds, aws_secretsmanager, CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

type DbProps = {
  vpc: aws_ec2.Vpc;
  vpcSubnets: aws_ec2.SubnetSelection;
  databaseName: string;
};

export class Db extends Construct {
  readonly instance: aws_rds.DatabaseInstance;
  readonly credsSecret: aws_secretsmanager.Secret;
  readonly securityGroup: aws_ec2.SecurityGroup;
  readonly databaseName: string;
  readonly port: number;

  constructor(scope: Construct, id: string, props: DbProps) {
    super(scope, id);

    this.databaseName = props.databaseName;

    this.credsSecret = new aws_secretsmanager.Secret(scope, 'DbCreds', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'stringsync' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    this.securityGroup = new aws_ec2.SecurityGroup(scope, 'DbSecurityGroup', {
      vpc: props.vpc,
      allowAllOutbound: true,
    });

    this.port = 5432;

    this.instance = new aws_rds.DatabaseInstance(scope, 'Database', {
      vpc: props.vpc,
      databaseName: this.databaseName,
      port: this.port,
      instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T2, aws_ec2.InstanceSize.MICRO),
      credentials: aws_rds.Credentials.fromSecret(this.credsSecret),
      vpcSubnets: props.vpcSubnets,
      engine: aws_rds.DatabaseInstanceEngine.postgres({ version: aws_rds.PostgresEngineVersion.VER_11 }),
      securityGroups: [this.securityGroup],
    });

    // NB: The export names are tied to the root gulpfile and will break the `adminmigrate` script if changed.
    new CfnOutput(this, 'DbCredsSecret', {
      value: this.credsSecret.secretName,
      exportName: 'DbCredsSecret',
    });
  }

  get hostname(): string {
    return this.instance.instanceEndpoint.hostname;
  }

  get username(): string {
    return this.credsSecret.secretValueFromJson('username').toString();
  }

  get password(): string {
    return this.credsSecret.secretValueFromJson('password').toString();
  }
}
