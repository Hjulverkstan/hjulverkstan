#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { CertStack } from '../lib/cert';
import { AppStack } from '../lib/app';
import { createEnvConfig } from './config';

const app = new cdk.App();

const stack = app.node.tryGetContext('stack');
const config = createEnvConfig(stack);

if (stack === 'cert') {
  new CertStack(
    app,
    'CertStack',
    {
      env: { account: config.account, region: 'us-east-1' },
      config,
    },
  );
}

else if (stack === 'app') {
  new AppStack(app, 'AppStack', {
    env: { account: config.account, region: 'eu-north-1' },
    instanceType: ec2.InstanceType.of(
      ec2.InstanceClass.T3,
      ec2.InstanceSize.MICRO,
    ),
    config,
  });
}

else {
  throw Error('You need to specify the stack to deploy using context, see the' +
    ' README.')
}

