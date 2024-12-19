import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib/core';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
export class frontend {

  // constructor(scope: Construct, id: string , certificate:  certificatemanager.ICertificate , hostedZone: route53.IHostedZone) {
  constructor(scope: Construct, id: string ,  certificate:  certificatemanager.ICertificate, hostedZone: route53.IHostedZone ) {

    // Import an existing certificate
    // const certificateArn = 'arn:aws:acm:us-east-1:730335549373:certificate/ea2780e0-0343-4b48-902c-3588aa19c016';
    // const certificate = acm.Certificate.fromCertificateArn(scope, 'ImportedCertificate', certificateArn);

    const s3CorsRule: s3.CorsRule = {
      allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.HEAD],
      allowedOrigins: ['*'],
      allowedHeaders: ['*'],
      maxAge: 300,
    };


    const bucket = new s3.Bucket(scope, 'ReactS3Bucket', {
      bucketName: 'front-end-s3',
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      accessControl: s3.BucketAccessControl.PRIVATE,
      cors: [s3CorsRule]
    });


    new CfnOutput(scope, 'ReactS3BucketPrint', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket',
    });
    //
    const originAccessIdentity = new cloudfront.OriginAccessIdentity(scope, 'OriginAccessIdentity');
    bucket.grantRead(originAccessIdentity);

    const distribution = new cloudfront.CloudFrontWebDistribution(scope, 'MyDistribution', {
      originConfigs: [
        {
          s3OriginSource: {
            s3BucketSource: bucket,
            originAccessIdentity: originAccessIdentity,
          },
          behaviors: [{ isDefaultBehavior: true }],
        },
      ],
      viewerCertificate: cloudfront.ViewerCertificate.fromAcmCertificate(certificate, {
        aliases: ['hjulverkstan.org'],
      }),
    });

    // Import existing hosted zone
    // const hostedZoneId = 'Z06587302B0UA1QW934WE';
    // const zoneName = 'hjulverkstan.org';
    // const hostedZone = route53.HostedZone.fromHostedZoneAttributes(scope, 'ImportedHostedZone', {
    //   hostedZoneId: hostedZoneId,
    //   zoneName: zoneName
    // });

    // new route53.ARecord(scope, 'AliasRecord', {
    //   zone: hostedZone,
    //   recordName: 'api.hjulverkstan.org',
    //   target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    // });

  }
}