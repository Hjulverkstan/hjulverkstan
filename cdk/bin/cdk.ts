#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

import { CertStack } from '../lib/cert';
import { AppStack } from '../lib/app';
import { createEnvConfig } from './config';
import { LambdaStack } from '../lib/lambda';

const app = new cdk.App();

const reason = app.node.tryGetContext('reason');
const config = createEnvConfig(reason);

if (reason === 'setup') {
  new CertStack(app, 'CertStack', {
    env: { account: config.account, region: 'us-east-1' },
    config,
  });
}

if (reason === 'setup' || reason === 'deploy') {
  new LambdaStack(app, 'LambdaStack', {
    env: {
      account: config.account,
      region: 'us-east-1',
    },
    config,
  });
}

if (reason === 'deploy') {
  new AppStack(app, 'AppStack', {
    env: { account: config.account, region: 'eu-north-1' },
    instanceType: ec2.InstanceType.of(
      ec2.InstanceClass.T3,
      ec2.InstanceSize.MICRO,
    ),
    config,
  });
}

if (!reason) {
  throw Error('You need to specify the reason for deployment, see README.');
}
