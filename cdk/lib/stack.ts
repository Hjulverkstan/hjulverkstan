import * as cdk from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib/core';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const engine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16_2 });
    const instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);

    const vpc = new Vpc(this, "Vpc", {
      maxAzs: 2
    });

    // Create an S3 bucket
    const bucket = new s3.Bucket(this, 'ReactS3Bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.KMS_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: 'stack-s3',
    });

    new CfnOutput(this, 'ReactS3BucketPrint', {
      value: bucket.bucketName,
      description: 'The name of the S3 bucket',
    });

    // Import existing hosted zone
    const hostedZoneId = 'Z06587302B0UA1QW934WE';
    const zoneName = 'hjulverkstan.org';
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'ImportedHostedZone', {
      hostedZoneId: hostedZoneId,
      zoneName: zoneName
    });

    // Import an existing certificate
    const certificateArn = 'arn:aws:acm:us-east-1:730335549373:certificate/ea2780e0-0343-4b48-902c-3588aa19c016';
    const certificate = acm.Certificate.fromCertificateArn(this, 'ImportedCertificate', certificateArn);

    // Create CloudFront distribution
    const distribution = new cloudfront.Distribution(this, 'MyDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
      domainNames: ['hjulverkstan.org'],
      certificate: certificate
    });

    // Create Route 53 alias record to CloudFront distribution
    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: 'hjulverkstan.org',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });

    // Define database credentials
    const availabilityZone = 'eu-north-1a';
    const dbUsername = 'postgres';
    const dbPassword = cdk.SecretValue.unsafePlainText('secretpass');
    // Create RDS instance
    const rdsInstance =new DatabaseInstance(this, 'PostgresDB', {
      engine,
      instanceType,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      credentials: Credentials.fromUsername(dbUsername, { password: dbPassword }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      availabilityZone: availabilityZone,
    });

    new CfnOutput(this, 'DbEndpoint', {
      value: rdsInstance.dbInstanceEndpointAddress, // The endpoint address
      description: 'The endpoint address of the Postgres database',
    });

    const secret = new secretsmanager.Secret(this, 'MySecret', {
      secretName: 'MyApp/MySecret',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'user' }),
        generateStringKey: 'password',
      },
    });

    // new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
    //   cluster: cluster,
    //   cpu: 256,
    //   desiredCount: 6,
    //   taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
    //   memoryLimitMiB: 2048,
    //   publicLoadBalancer: true
    // });


    // Create an S3 bucket for CodeDeploy
    const codeDeployBucket = new s3.Bucket(this, 'dev_codeDeploy_bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY // Set to RETAIN for production
    });

    // Create an IAM Role for CodeDeploy
    const codeDeployRole = new iam.Role(this, 'dev_codeDeploy_role', {
      assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com')
    });

    // Attach policies to allow access to the S3 bucket and logging
    codeDeployRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [codeDeployBucket.bucketArn],
      actions: ['s3:GetObject', 's3:ListBucket']
    }));

    codeDeployRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: ['*'], // You might want to restrict this further
      actions: [
        'cloudwatch:PutMetricData',
        'logs:CreateLogGroup',
        'logs:CreateLogStream',
        'logs:PutLogEvents',
        'ec2:DescribeInstances',
        'codedeploy:*'
      ]
    }));

    codeDeployRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSCodeDeployRole'));

    const userDataScript = `#!/bin/bash
            sudo yum update -y
            sudo yum install ruby -y
            sudo yum install wget -y
            wget https://aws-codedeploy-eu-north-1.s3.eu-north-1.amazonaws.com/latest/install
            chmod a+x install
            sudo ./install auto
            sudo systemctl start codedeploy-agent
            
            echo "Java Install........."
            sudo yum install -y java-21-amazon-corretto.x86_64
            java --version
        `;

    // Define the key pair
    const keyPair = ec2.KeyPair.fromKeyPairName(this, 'KEYPAIR', 'awsbikejeus');


    // Create a security group
    const securityGroup = new ec2.SecurityGroup(this, 'MySecurityGroup', {
      vpc,
      allowAllOutbound: true // Allow outbound traffic
    });

    // Define ingress rules
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080), 'Allow 8080 access to the service');

    // Create an EC2 role for CodeDeploy
    const ec2CodeDeployRole = new iam.Role(this, 'CodeDeployRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSCodeDeployRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM')
      ]
    });


    // Create an EC2 instance
    const backendInstance = new ec2.Instance(this, 'dev_backend_ec2', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM), // Change to your preferred type
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC
      },
      securityGroup,
      keyPair: keyPair,
      userData: ec2.UserData.custom(userDataScript),
      associatePublicIpAddress: true,
      role: ec2CodeDeployRole
    });

    // Create a CodeDeploy application
    const codeDeployApp = new codedeploy.CfnApplication(this, 'dev_back_codedeploy', {
      applicationName: 'dev_back_bike_application',
      computePlatform: 'Server' // For EC2 instances
    });

    // Create a CodeDeploy deployment group
    new codedeploy.CfnDeploymentGroup(this, 'dev_back_deploymentgroup', {
      applicationName: codeDeployApp.applicationName as string,
      deploymentGroupName: 'dev_back_deploymentgroup_name',
      serviceRoleArn: codeDeployRole.roleArn,
      ec2TagFilters: [{
        key: 'Name', // Tag the instance with a name
        value: 'Dev-Stack/dev_backend_ec2',
        type: 'KEY_AND_VALUE'
      }]
    });

    // Output the public IP of the EC2 instance
    new CfnOutput(this, 'InstancePublicIp', {
      value: backendInstance.instancePublicIp,
      description: 'Public IP of the EC2 instance'
    });
  }

}
