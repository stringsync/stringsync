import { aws_ec2, aws_iam, aws_s3_assets, CfnOutput } from 'aws-cdk-lib';
import { KeyPair } from 'cdk-ec2-key-pair';
import { Construct } from 'constructs';

type AdminInstanceProps = {
  vpc: aws_ec2.Vpc;
};

export class AdminInstance extends Construct {
  readonly securityGroup: aws_ec2.SecurityGroup;
  readonly ec2Instance: aws_ec2.Instance;
  readonly role: aws_iam.Role;

  constructor(scope: Construct, id: string, props: AdminInstanceProps) {
    super(scope, id);

    // Create a Key Pair to be used with this EC2 Instance
    const key = new KeyPair(this, 'AdminInstanceKeyPair', {
      name: 'admin-instance-keypair',
      description: 'Key Pair created with CDK Deployment',
    });

    // Allow SSH (TCP Port 22) access from anywhere
    this.securityGroup = new aws_ec2.SecurityGroup(this, 'AdminInstanceSecurityGroup', {
      vpc: props.vpc,
      description: 'Allow SSH (TCP port 22) in',
      allowAllOutbound: true,
    });
    this.securityGroup.addIngressRule(aws_ec2.Peer.anyIpv4(), aws_ec2.Port.tcp(22), 'Allow SSH Access');

    this.role = new aws_iam.Role(this, 'ec2Role', {
      assumedBy: new aws_iam.ServicePrincipal('ec2.amazonaws.com'),
    });

    this.role.addManagedPolicy(aws_iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'));

    // Use Latest Amazon Linux Image - CPU Type ARM64
    const ami = new aws_ec2.AmazonLinuxImage({
      generation: aws_ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      cpuType: aws_ec2.AmazonLinuxCpuType.X86_64,
    });

    // Create the instance using the Security Group, AMI, and KeyPair defined in the VPC created
    this.ec2Instance = new aws_ec2.Instance(this, 'Ec2Instance', {
      vpc: props.vpc,
      instanceType: aws_ec2.InstanceType.of(aws_ec2.InstanceClass.T2, aws_ec2.InstanceSize.MICRO),
      machineImage: ami,
      securityGroup: this.securityGroup,
      keyName: key.keyPairName,
      role: this.role,
      vpcSubnets: { subnetType: aws_ec2.SubnetType.PUBLIC },
    });

    // Create an asset that will be used as part of User Data to run on first load
    const asset = new aws_s3_assets.Asset(this, 'AdminInstanceConfigScript', { path: 'scripts/config.sh' });
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
    new CfnOutput(this, 'IP Address', { value: this.ec2Instance.instancePublicIp });
    new CfnOutput(this, 'Key Name', { value: key.keyPairName });

    // NB: The export names are tied to the root gulpfile and will break the `admin` script if changed.
    const downloadKeyCommand = new CfnOutput(this, 'Download Key Command', {
      exportName: 'AdminInstanceDownloadKeyCommand',
      value: `aws secretsmanager get-secret-value --secret-id ec2-ssh-key/${key.keyPairName}/private --query SecretString --output text > ${key.keyPairName}.pem && chmod 400 ${key.keyPairName}.pem`,
    });
    const sshCommand = new CfnOutput(this, 'ssh command', {
      exportName: 'AdminInstanceSshCommand',
      value: `ssh -i ${key.keyPairName}.pem -o IdentitiesOnly=yes ec2-user@${this.ec2Instance.instancePublicIp}`,
    });
  }
}
