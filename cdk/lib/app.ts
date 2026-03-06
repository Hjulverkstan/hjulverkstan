import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { CfnOutput } from 'aws-cdk-lib';
import { Construct } from 'constructs';

import { EnvConfig } from '../bin/config';

export interface AppStackProps extends cdk.StackProps {
  config: EnvConfig;
  instanceType: ec2.InstanceType;
}

export class AppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: AppStackProps) {
    super(scope, id, props);

    const zone = route53.HostedZone.fromLookup(this, 'HostedZone', {
      domainName: props.config.siteDomain,
    });

    // API
    // For deploying assets to the ec2
    const ec2DeployAssetsBucket = new s3.Bucket(this, 'EC2DeployAssetsBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      bucketName: `ec2-deploy-assets-${props.config.bucketSuffix}`,
    });

    new CfnOutput(this, 'CfnEc2DeployAssetsBucketName', {
      value: ec2DeployAssetsBucket.bucketName,
      description: 'The name of the ec2 deploy assets bucket',
      exportName: 'EC2DeployAssetsBucketName',
    });

    const ec2DeployAssetsRole = new iam.Role(this, 'EC2DeployAssetsRole', {
      assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
      description:
        'Custom role for deploying assets through the' +
        ' deployment assets bucket',
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AWSLambdaBasicExecutionRole',
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
      ],
    });

    const ec2DeployAssetsBucketDeployment = new s3deploy.BucketDeployment(
      this,
      'EC2DeployAssetsBucketDeployment',
      {
        sources: [s3deploy.Source.asset('./assets-ec2')],
        destinationBucket: ec2DeployAssetsBucket,
        role: ec2DeployAssetsRole,
      },
    );

    ec2DeployAssetsBucketDeployment.node.addDependency(ec2DeployAssetsBucket);

    // Networking

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 1,
      natGateways: 0,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC,
        },
      ],
    });

    const securityGroup = new ec2.SecurityGroup(this, 'SecurityGroup', {
      description: 'Allow SSH, HTTP, HTTPS, and App Traffic',
      allowAllOutbound: true,
      vpc,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'SSH');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'HTTP');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'SSL');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080), 'API');

    // Instance

    const role = new iam.Role(this, 'Ec2InstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AmazonSSMManagedInstanceCore',
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
      ],
    });

    const instance = new ec2.Instance(this, 'Instance', {
      instanceType: props.instanceType,
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      blockDevices: [
        {
          deviceName: '/dev/xvda',
          volume: ec2.BlockDeviceVolume.ebs(40, {
            volumeType: ec2.EbsDeviceVolumeType.GP3,
            deleteOnTermination: true,
          }),
        },
      ],
      securityGroup,
      vpc,
      role,
    });

    instance.node.addDependency(ec2DeployAssetsBucketDeployment);

    instance.addUserData(`
      #!/bin/bash
      mkdir /opt/docker && cd /opt/docker
      aws s3 cp s3://${ec2DeployAssetsBucket.bucketName}/ . --recursive
      chmod +x setup.sh
      ./setup.sh
    `);

    // Back up bucket

    const backupBucket = new s3.Bucket(this, 'BackupBucket', {
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      autoDeleteObjects: false,
      bucketName: `backup-bucket-${props.config.bucketSuffix}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      lifecycleRules: [
        {
          id: 'DeleteOldBackups',
          enabled: true,
          expiration: cdk.Duration.days(30),
          noncurrentVersionExpiration: cdk.Duration.days(30)
        }
      ]
    });

    new CfnOutput(this, 'CfnBackupBucketName', {
      value: backupBucket.bucketName,
      description: 'The name of the backup bucket',
      exportName: 'BackupBucketName',
    });

    backupBucket.grantReadWrite(instance.role);

    // Domain for SSH

    new acm.Certificate(this, 'CertSshDomain', {
      domainName: props.config.sshDomain,
      validation: acm.CertificateValidation.fromDns(zone),
    });

    new route53.ARecord(this, 'SshAliasRecord', {
      zone: zone,
      recordName: props.config.sshRecordName,
      target: route53.RecordTarget.fromIpAddresses(
        instance.instancePublicIp,
      ),
      ttl: cdk.Duration.minutes(5),
    });

    // WEB

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
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      bucketName: `images-bucket-${props.config.bucketSuffix}`,
    });

    imageBucket.grantPut(instance.role);
    imageBucket.grantDelete(instance.role);

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
      'StaticRoutingVersionFromEnv',
      props.config.routingLambdaArn,
    );

    const distribution = new cloudfront.Distribution(this, 'Distribution', {
      defaultRootObject: 'index.html',
      domainNames: [props.config.siteDomain],
      certificate,

      errorResponses: [
        {
          httpStatus: 403,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
        {
          httpStatus: 404,
          responseHttpStatus: 200,
          responsePagePath: '/index.html',
          ttl: cdk.Duration.minutes(0),
        },
      ],

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
          origin: new origins.HttpOrigin(instance.instancePublicDnsName, {
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
      zone: zone,
    });
  }
}
