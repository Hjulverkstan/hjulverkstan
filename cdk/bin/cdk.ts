#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Stack } from '../lib/stack';

const app = new cdk.App();

new Stack(app, 'Dev-Stack', {
  env: { account: process.env.CDK_DEV_ACCOUNT, region: process.env.CDK_REGION }
});

// Steps to run Ecs stack in AWS CLI
//cdk bootsrap --profile dev-user
//cdk deploy