import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { EnvConfig } from '../bin/config';

interface DnsStackProps extends cdk.StackProps {
  config: EnvConfig;
}

export class DnsStack extends cdk.Stack {
  public readonly zone: route53.IHostedZone;

  constructor(scope: Construct, id: string, props: DnsStackProps) {
    super(scope, id, props);

    if (!props.config.isProd) {
      // Is some staging env
      const delegatedZone = new route53.PublicHostedZone(
        this,
        'DelegatedZone',
        {
          zoneName: props.config.siteDomain,
        },
      );

      // This prints the NS that it can be passed through env vars into
      // config.siteRootDelegations for the prod environment
      new CfnOutput(this, 'DelegatedZoneNameServers', {
        value: cdk.Fn.join(',', delegatedZone.hostedZoneNameServers ?? []),
        description: `Name servers for ${props.config.siteDomain}`,
      });

      this.zone = delegatedZone;
    } else {
      // Is prod environment
      this.zone = new route53.PublicHostedZone(this, 'ApexZone', {
        zoneName: props.config.apexDomain,
      });

      // Create name server records with the names server outputted from the
      // staging environments
      for (const { recordName, nameServers } of props.config
        .siteRootDelegations) {
        new route53.NsRecord(this, `Delegate-${recordName}`, {
          zone: this.zone,
          recordName,
          values: nameServers,
          ttl: cdk.Duration.minutes(30),
        });
      }
    }
  }
}
