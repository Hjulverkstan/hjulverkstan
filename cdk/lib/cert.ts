import * as cdk from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { EnvConfig } from '../bin/config';
import { CfnOutput } from 'aws-cdk-lib';

interface CertStackProps extends cdk.StackProps {
  config: EnvConfig;
}

export class CertStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CertStackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.config.apexDomain,
    });

    const certSite = new acm.Certificate(this, 'CertSite', {
      domainName: props.config.siteDomain,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    new CfnOutput(this, 'CfnCertArn', {
      value: certSite.certificateArn,
      description: 'The ARN of the site\'s cert',
      exportName: 'SiteArn',
    });
  }
}
