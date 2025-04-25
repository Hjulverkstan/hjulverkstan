import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { EnvConfig } from '../bin/config';

export interface LambdaStackProps extends cdk.StackProps {
  config: EnvConfig;
}

export class LambdaStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: LambdaStackProps) {
    super(scope, id, props);

    const routingLambda = new cloudfront.experimental.EdgeFunction(
      this,
      'RoutingLambda',
      {
        runtime: lambda.Runtime.NODEJS_22_X,
        handler: 'routing.handler',
        code: lambda.Code.fromAsset('lambda', {
          bundling: {
            image: lambda.Runtime.NODEJS_22_X.bundlingImage,
            environment: {
              ROUTE_MANIFEST_URL: `https://site-bucket-${props.config.bucketSuffix}.s3.amazonaws.com/route-manifest.json`,
            },
            command: [
              'bash',
              '-c',
              'cp -r . /asset-output/ && sed -i' +
              ' "s|__ROUTE_MANIFEST_URL__|${ROUTE_MANIFEST_URL}|g"' +
              ' /asset-output/routing.js',
            ],
          },
        }),
        memorySize: 128,
        timeout: cdk.Duration.seconds(5),
      },
    );

    new cdk.CfnOutput(this, 'RoutingLambdaVersionArn', {
      value: routingLambda.currentVersion.functionArn,
      exportName: 'RoutingLambdaVersionArn',
    });
  }
}
