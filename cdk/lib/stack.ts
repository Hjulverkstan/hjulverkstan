import * as cdk from 'aws-cdk-lib';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
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

    // Define database credentials
    const dbUsername = 'postgres';
    const dbPassword = cdk.SecretValue.unsafePlainText('secretpass');
    // Create RDS instance
    new DatabaseInstance(this, 'PostgresDB', {
    engine,
    instanceType,
    vpc,
    vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS}, // Use private subnets with NAT Gateway
    credentials: Credentials.fromUsername(dbUsername, { password: dbPassword }),
    removalPolicy: cdk.RemovalPolicy.DESTROY, // Destroy RDS instance when stack is deleted (for testing purposes)
  });

  // Create an S3 bucket
  new s3.Bucket(this, 'ReactS3Bucket', {
    versioned: true, // Enable versioning
    removalPolicy: cdk.RemovalPolicy.DESTROY, // This will delete the bucket when the stack is deleted
    autoDeleteObjects: true, // This will delete objects when the bucket is deleted
    encryption: s3.BucketEncryption.KMS_MANAGED, // Use KMS encryption managed by AWS Key Management Service
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL, // Block public access to the bucket
    bucketName: 'frontend-1-bucket', // Optional: specify a bucket name
    // Add other bucket configurations as needed
  });
  

  new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
    cluster: cluster,
    cpu: 256,
    desiredCount: 6,
    taskImageOptions: {image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")},
    memoryLimitMiB: 2048,
    publicLoadBalancer: true
  });

  }
}
