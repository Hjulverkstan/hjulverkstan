import * as cdk from 'aws-cdk-lib';
import * as ec2 from '@aws-cdk/aws-ec2';
//import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
//import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
//import * as route53 from 'aws-cdk-lib/aws-route53';
//import * as targets from 'aws-cdk-lib/aws-route53-targets';
//import * as acm from 'aws-cdk-lib/aws-certificatemanager';
// import * as ecs from 'aws-cdk-lib/aws-ecs';
//import * as s3 from 'aws-cdk-lib/aws-s3';
//import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';

import { Construct } from 'constructs';

export class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC

    const vpc = new ec2.Vpc(this, 'Vpc', {
      maxAzs: 2,
    });

    // RDS

    const dbUsername = 'postgres';
    const dbPassword = cdk.SecretValue.unsafePlainText('secretpass');

    const engine = rds.DatabaseInstanceEngine.postgres({
      version: rds.PostgresEngineVersion.VER_16_2,
    });
    const instanceType = ec2.InstanceType.of(
      ec2.InstanceClass.T3,
      ec2.InstanceSize.MICRO,
    );

    new rds.DatabaseInstance(this, 'PostgresDB', {
      engine,
      instanceType,
      vpc,
      vpcSubnets: { subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS },
      credentials: rds.Credentials.fromUsername(dbUsername, {
        password: dbPassword,
      }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    // EC2

    // const cluster = new ecs.Cluster(this, 'Cluster', {
    //    vpc: vpc,
    // });

    const instance = new ec2.Instance(this, 'Instance', {
      vpc,
      instanceType: new ec2.InstanceType('t3.micro'),
      machineImage: ec2.MachineImage.latestAmazonLinux({
        generation: ec2.AmazonLinuxGeneration.AMAZON_LINUX_2,
      }),
      keyName: 'your-key-pair-name',
    });

    // UserData to install Java
    instance.addUserData(
      'sudo yum update -y',
      'sudo yum install -y java-11-openjdk-devel',
      'echo "Java installed successfully"',
      // TODO: Create systemctl service here?
    );
    /*

    // S3

    const bucket = new s3.Bucket(this, 'ReactS3Bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      encryption: s3.BucketEncryption.KMS_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      bucketName: 'stack-s3',
    });

    // CloudFront

    // TODO: best practice with this certificate, secrets?
    const certificateArn = 'arn:aws:acm:us-east-1:730335549373:certificate/ea2780e0-0343-4b48-902c-3588aa19c016';
    const certificate = acm.Certificate.fromCertificateArn(this, 'ImportedCertificate', certificateArn);

    // Create CloudFront distribution
    // TODO: Setup caching policies
    const distribution = new cloudfront.Distribution(this, 'MyDistribution', {
      defaultBehavior: { origin: new origins.S3Origin(bucket) },
      domainNames: ['hjulverkstan.org'], // TODO: Domain should be dynamic per stack.
      certificate: certificate
    });

    // Import existing hosted zone
    const hostedZoneId = 'Z06587302B0UA1QW934WE';
    const zoneName = 'hjulverkstan.org';
    const hostedZone = route53.HostedZone.fromHostedZoneAttributes(this, 'ImportedHostedZone', {
      hostedZoneId: hostedZoneId,
      zoneName: zoneName
    });

    // Create Route 53 alias record to CloudFront distribution
    new route53.ARecord(this, 'AliasRecord', {
      zone: hostedZone,
      recordName: 'hjulverkstan.org',
      target: route53.RecordTarget.fromAlias(new targets.CloudFrontTarget(distribution)),
    });c

    */
  }
}
