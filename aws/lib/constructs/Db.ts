import * as ec2 from '@aws-cdk/aws-ec2';
import * as rds from '@aws-cdk/aws-rds';
import * as secretsmanager from '@aws-cdk/aws-secretsmanager';
import * as cdk from '@aws-cdk/core';

type DbProps = {
  vpc: ec2.Vpc;
  vpcSubnets: ec2.SubnetSelection;
  databaseName: string;
};

export class Db extends cdk.Construct {
  readonly instance: rds.DatabaseInstance;
  readonly credsSecret: secretsmanager.Secret;
  readonly securityGroup: ec2.SecurityGroup;
  readonly databaseName: string;

  constructor(scope: cdk.Construct, id: string, props: DbProps) {
    super(scope, id);

    this.databaseName = props.databaseName;

    this.credsSecret = new secretsmanager.Secret(scope, 'DbCreds', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'stringsync' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        includeSpace: false,
      },
    });

    this.securityGroup = new ec2.SecurityGroup(scope, 'DbSecurityGroup', {
      vpc: props.vpc,
      allowAllOutbound: true,
    });

    this.instance = new rds.DatabaseInstance(scope, 'Database', {
      vpc: props.vpc,
      databaseName: this.databaseName,
      port: 5432,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      credentials: rds.Credentials.fromSecret(this.credsSecret),
      vpcSubnets: props.vpcSubnets,
      engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_11 }),
      securityGroups: [this.securityGroup],
    });
  }

  get hostname(): string {
    return this.instance.instanceEndpoint.hostname;
  }

  get port(): string {
    return '5432';
  }

  get username(): string {
    return this.credsSecret.secretValueFromJson('username').toString();
  }

  get password(): string {
    return this.credsSecret.secretValueFromJson('password').toString();
  }
}
