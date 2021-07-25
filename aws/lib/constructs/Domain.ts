import * as certificatemanager from '@aws-cdk/aws-certificatemanager';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as route53 from '@aws-cdk/aws-route53';
import * as cdk from '@aws-cdk/core';

type DomainProps = {
  vpc: ec2.IVpc;
  domainName: string;
  hostedZoneName: string;
  hostedZoneId: string;
  subdomainNames: string[];
};

export class Domain extends cdk.Construct {
  readonly name: string;
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

    this.name = props.domainName;
    this.subdomainNames = props.subdomainNames;

    this.certificate = new certificatemanager.Certificate(this, 'Certificate', {
      domainName: this.name,
      subjectAlternativeNames: this.subdomainNames.map((subdomainName) => this.sub(subdomainName)),
      validation: certificatemanager.CertificateValidation.fromDns(this.hostedZone),
    });
  }

  sub(subdomainName: string): string {
    return `${subdomainName}.${this.name}`;
  }

  registerTarget(recordId: string, recordName: string, target: route53.RecordTarget): route53.RecordSet {
    const record = new route53.ARecord(this, recordId, {
      zone: this.hostedZone,
      recordName,
      target,
    });
    this.records.push(record);
    return record;
  }
}
