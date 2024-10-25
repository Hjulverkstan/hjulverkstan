import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import { CfnOutput } from 'aws-cdk-lib/core';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';

export class frontend {

  constructor(scope: Construct, id: string) {

    // Import an existing certificate
    const certificateArn = 'arn:aws:acm:us-east-1:730335549373:certificate/ea2780e0-0343-4b48-902c-3588aa19c016';
    const certificate = acm.Certificate.fromCertificateArn(scope, 'ImportedCertificate', certificateArn);




    const bucket = new s3.Bucket(scope, 'ReactS3Bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.KMS_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: 'stack-s3',
    });

    new CfnOutput(scope, 'ReactS3BucketPrint', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket',
    });

    const distribution = new cloudfront.Distribution(scope, 'MyDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
      domainNames: ['hjulverkstan.org'],
      certificate: certificate
    });

    // Import existing hosted zone
    const hostedZoneId = 'Z06587302B0UA1QW934WE';
    const zoneName = 'hjulverkstan.org';
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(scope, 'ImportedHostedZone', {
      hostedZoneId: hostedZoneId,
      zoneName: zoneName
    });

    new route53.ARecord(scope, 'AliasRecord', {
      zone: hostedZone,
      recordName: 'hjulverkstan.org',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

  }



}