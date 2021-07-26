import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';
import { Asset } from '@aws-cdk/aws-s3-assets';
import * as cdk from '@aws-cdk/core';
import { KeyPair } from 'cdk-ec2-key-pair';

type AdminInstanceProps = {
  vpc: ec2.Vpc;
};

export class AdminInstance extends cdk.Construct {
  readonly securityGroup: ec2.SecurityGroup;
  readonly ec2Instance: ec2.Instance;
  readonly role: iam.Role;

  constructor(scope: cdk.Construct, id: string, props: AdminInstanceProps) {
    super(scope, id);

    // Create a Key Pair to be used with this EC2 Instance
    const key = new KeyPair(this, 'AdminInstanceKeyPair', {
      name: 'admin-instance-keypair',
      description: 'Key Pair created with CDK Deployment',
    });

    // Allow SSH (TCP Port 22) access from anywhere
    this.securityGroup = new ec2.SecurityGroup(this, 'AdminInstanceSecurityGroup', {
      vpc: props.vpc,
      description: 'Allow SSH (TCP port 22) in',
      allowAllOutbound: true,
    });
    this.securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH Access');

    this.role = new iam.Role(this, 'ec2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    this.role.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    // Use Latest Amazon Linux Image - CPU Type ARM64
    const ami = new ec2.AmazonLinuxImage({
      generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: ec2.AmazonLinuxCpuType.X86_64,
    });

    // Create the instance using the Security Group, AMI, and KeyPair defined in the VPC created
    this.ec2Instance = new ec2.Instance(this, 'Ec2Instance', {
      vpc: props.vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T2, ec2.InstanceSize.MICRO),
      machineImage: ami,
      securityGroup: this.securityGroup,
      keyName: key.keyPairName,
      role: this.role,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
    });

    // Create an asset that will be used as part of User Data to run on first load
    const asset = new Asset(this, 'AdminInstanceConfigScript', { path: 'scripts/config.sh' });
    const localPath = this.ec2Instance.userData.addS3DownloadCommand({
      bucket: asset.bucket,
      bucketKey: asset.s3ObjectKey,
    });

    this.ec2Instance.userData.addExecuteFileCommand({
      filePath: localPath,
      arguments: '--verbose -y',
    });
    asset.grantRead(this.ec2Instance.role);

    // Create outputs for connecting
    new cdk.CfnOutput(this, 'IP Address', { value: this.ec2Instance.instancePublicIp });
    new cdk.CfnOutput(this, 'Key Name', { value: key.keyPairName });
    new cdk.CfnOutput(this, 'Download Key Command', {
      value: `aws secretsmanager get-secret-value --secret-id ec2-ssh-key/${key.keyPairName}/private --query SecretString --output text > ${key.keyPairName}.pem && chmod 400 ${key.keyPairName}.pem`,
    });
    new cdk.CfnOutput(this, 'ssh command', {
      value: `ssh -i ${key.keyPairName}.pem -o IdentitiesOnly=yes ec2-user@${this.ec2Instance.instancePublicIp}`,
    });
  }
}
