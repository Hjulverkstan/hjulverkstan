import * as cdk from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';

export class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const engine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16_2 });
    const instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);

    const vpc = new Vpc(this, "Vpc", {
      maxAzs: 2
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc
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
    const dbUsername = 'postgres';
    const dbPassword = cdk.SecretValue.unsafePlainText('secretpass');
    // Create RDS instance
    new DatabaseInstance(this, 'PostgresDB', {
      engine,
      instanceType,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      credentials: Credentials.fromUsername(dbUsername, { password: dbPassword }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster: cluster,
      cpu: 256,
      desiredCount: 6,
      taskImageOptions: { image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample") },
      memoryLimitMiB: 2048,
      publicLoadBalancer: true
    });

  }
}
