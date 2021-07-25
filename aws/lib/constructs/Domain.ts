import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

type RegisterTargetProps = {
  recordName: string;
  target: route53.RecordTarget;
};

type DomainProps = {
  vpc: ec2.IVpc;
  domainName: string;
  hostedZoneName: string;
  hostedZoneId: string;
  subdomainNames: string[];
};

export class Domain extends cdk.Construct {
  readonly domainName: string;
  readonly hostedZone: route53.IHostedZone;
  readonly records: route53.RecordSet[] = [];
  readonly certificate: certificatemanager.Certificate;
  readonly subdomainNames = new Array<string>();

  constructor(scope: cdk.Construct, id: string, props: DomainProps) {
    super(scope, id);

    this.hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'HostedZone', {
      zoneName: props.hostedZoneName,
      hostedZoneId: props.hostedZoneId,
    });

    this.domainName = props.domainName;
    this.subdomainNames = props.subdomainNames;

    this.certificate = new certificatemanager.Certificate(this, 'Certificate', {
      domainName: this.domainName,
      subjectAlternativeNames: this.subdomainNames.map((subdomainName) => this.sub(subdomainName)),
      validation: certificatemanager.CertificateValidation.fromDns(this.hostedZone),
    });
  }

  sub(subdomainName: string): string {
    return `${subdomainName}.${this.domainName}`;
  }

  registerTarget(scope: cdk.Construct, recordId: string, props: RegisterTargetProps): route53.RecordSet {
    const record = new route53.ARecord(scope, recordId, {
      zone: this.hostedZone,
      recordName: props.recordName,
      target: props.target,
    });
    this.records.push(record);
    return record;
  }
}
