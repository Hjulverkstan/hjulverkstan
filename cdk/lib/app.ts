import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';

import { EnvConfig } from '../bin/config';
import { ApiStack } from './app-api';
import { WebStack } from './app-web';

export interface AppStackProps extends cdk.StackProps {
  config: EnvConfig;
  instanceType: ec2.InstanceType;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.config.apexDomain,
    });

    const { instance } = new ApiStack(this, 'ApiStack', {
      config: props.config,
      instanceType: props.instanceType,
      zone,
    });

    new WebStack(this, 'WebStack', {
      config: props.config,
      zone,
      instance,
    });
  }
}
