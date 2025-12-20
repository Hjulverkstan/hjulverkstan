import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import { IHostedZone } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { EnvConfig } from '../bin/config';

interface CertStackProps extends cdk.StackProps {
  config: EnvConfig;
  zone: IHostedZone;
}

export class CertStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: CertStackProps) {
    super(scope, id, props);

    const certSite = new acm.Certificate(this, 'CertSite', {
      domainName: props.config.siteDomain,
      validation: acm.CertificateValidation.fromDns(props.zone),
    });

    new CfnOutput(this, 'CfnCertArn', {
      value: certSite.certificateArn,
      description: "The ARN of the site's cert",
      exportName: 'SiteArn',
    });
  }
}
