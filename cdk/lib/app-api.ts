import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { CfnOutput, StackProps } from 'aws-cdk-lib';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as s3deploy from 'aws-cdk-lib/aws-s3-deployment';

import { EnvConfig } from '../bin/config';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';

export interface ApiStackProps extends StackProps {
  config: EnvConfig;
  zone: route53.IHostedZone;
  instanceType: ec2.InstanceType;
}

export class ApiStack extends cdk.Stack {
  public readonly instance: ec2.Instance;

  constructor(scope: Construct, id: string, props: ApiStackProps) {
    super(scope, id, props);

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

    this.instance = new ec2.Instance(this, 'Instance', {
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

    this.instance.node.addDependency(ec2DeployAssetsBucketDeployment);

    this.instance.addUserData(`
      #!/bin/bash
      mkdir /opt/docker && cd /opt/docker
      aws s3 cp s3://${ec2DeployAssetsBucket.bucketName}/ . --recursive
      chmod +x setup.sh
      ./setup.sh
    `);

    // Domain for SSH

    new acm.Certificate(this, 'CertSshDomain', {
      domainName: props.config.sshDomain,
      validation: acm.CertificateValidation.fromDns(props.zone),
    });

    new route53.ARecord(this, 'SshAliasRecord', {
      zone: props.zone,
      recordName: props.config.sshRecordName,
      target: route53.RecordTarget.fromIpAddresses(
        this.instance.instancePublicIp,
      ),
      ttl: cdk.Duration.minutes(5),
    });
  }
}
