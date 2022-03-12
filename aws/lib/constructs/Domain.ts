import { aws_certificatemanager, aws_ec2, aws_route53 } from 'aws-cdk-lib';
import { Construct } from 'constructs';

type RegisterTargetProps = {
  subdomain: string;
  target: aws_route53.RecordTarget;
};

type DomainProps = {
  vpc: aws_ec2.IVpc;
  domainName: string;
  hostedZoneName: string;
  hostedZoneId: string;
  subdomainNames: string[];
};

export class Domain extends Construct {
  readonly domainName: string;
  readonly hostedZone: aws_route53.IHostedZone;
  readonly records: aws_route53.RecordSet[] = [];
  readonly certificate: aws_certificatemanager.Certificate;
  readonly subdomainNames = new Array<string>();

  constructor(scope: Construct, id: string, props: DomainProps) {
    super(scope, id);

    this.hostedZone = aws_route53.HostedZone.fromHostedZoneAttributes(scope, 'HostedZone', {
      zoneName: props.hostedZoneName,
      hostedZoneId: props.hostedZoneId,
    });

    this.domainName = props.domainName;
    this.subdomainNames = props.subdomainNames;

    this.certificate = new aws_certificatemanager.Certificate(scope, 'Certificate', {
      domainName: this.domainName,
      subjectAlternativeNames: this.subdomainNames.map((subdomainName) => this.sub(subdomainName)),
      validation: aws_certificatemanager.CertificateValidation.fromDns(this.hostedZone),
    });
  }

  sub(subdomainName: string): string {
    return `${subdomainName}.${this.domainName}`;
  }

  registerTarget(scope: Construct, recordId: string, props: RegisterTargetProps): aws_route53.RecordSet {
    const record = new aws_route53.ARecord(scope, recordId, {
      zone: this.hostedZone,
      recordName: props.subdomain,
      target: props.target,
    });
    this.records.push(record);
    return record;
  }
}
