import { Construct } from 'constructs';
import * as cdk from 'aws-cdk-lib';
import { CfnOutput, StackProps } from 'aws-cdk-lib';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as lambda from 'aws-cdk-lib/aws-lambda';

import { EnvConfig } from '../bin/config';

interface WebStackProps extends StackProps {
  instance: ec2.Instance;
  zone: route53.IHostedZone;
  config: EnvConfig;
}

export class WebStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: WebStackProps) {
    super(scope, id, props);

    const siteBucket = new s3.Bucket(this, 'SiteBucket', {
      websiteIndexDocument: 'index.html',
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      bucketName: `site-bucket-${props.config.bucketSuffix}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS
    });

    new CfnOutput(this, 'CfnSiteBucketName', {
      value: siteBucket.bucketName,
      description: 'The name of the site bucket',
      exportName: 'SiteBucketName',
    });

    const imageBucket = new s3.Bucket(this, 'ImageBucket', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      bucketName: `images-bucket-${props.config.bucketSuffix}`,
    });

    new CfnOutput(this, 'CfnImageBucketName', {
      value: imageBucket.bucketName,
      description: 'The name of the images bucket',
      exportName: 'ImageBucketName',
    });

    //

    const certificate = acm.Certificate.fromCertificateArn(
      this,
      'ImportedCert',
      props.config.siteCertArn,
    );

    const importedRoutingLambdaVersion = lambda.Version.fromVersionArn(
      this,
      'ImportedRoutingLambdaVersion',
      props.config.routingLambdaArn,
    );

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      domainNames: [props.config.siteDomain],
      certificate,

      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(siteBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        compress: true,
        edgeLambdas: [
          {
            functionVersion: importedRoutingLambdaVersion,
            eventType: cloudfront.LambdaEdgeEventType.ORIGIN_REQUEST,
          },
        ],
      },

      additionalBehaviors: {
        '/api/*': {
          origin: new origins.HttpOrigin(props.instance.instancePublicDnsName, {
            protocolPolicy: cloudfront.OriginProtocolPolicy.HTTP_ONLY,
            originPath: '/v1',
            httpPort: 8080,
          }),
          viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.ALLOW_ALL,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
          cachedMethods: cloudfront.CachedMethods.CACHE_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
          originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER,
          compress: true,
        },
        '/images/*': {
          origin: origins.S3BucketOrigin.withOriginAccessControl(imageBucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
          allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
          cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
          compress: true,
        },
      },
    });

    //

    const permitDistributionToBucket = (bucket: s3.Bucket) =>
      bucket.addToResourcePolicy(
        new iam.PolicyStatement({
          actions: ['s3:GetObject'],
          resources: [bucket.arnForObjects('*')],
          principals: [new iam.ServicePrincipal('cloudfront.amazonaws.com')],
          conditions: {
            StringEquals: {
              'AWS:SourceArn': `arn:aws:cloudfront::${props.config.account}:distribution/${distribution.distributionId}`,
            },
          },
        }),
      );

    permitDistributionToBucket(siteBucket);
    permitDistributionToBucket(imageBucket);

    siteBucket.addToResourcePolicy(
      new iam.PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [siteBucket.arnForObjects('route-manifest.json')],
        principals: [new iam.AnyPrincipal()],
      }),
    );

    //

    new route53.ARecord(this, 'CloudFrontAliasRecord', {
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
      zone: props.zone,
    });
  }
}
