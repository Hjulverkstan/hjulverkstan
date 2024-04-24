import * as cdk from 'aws-cdk-lib';
import {
  InstanceClass,
  InstanceSize,
  InstanceType,
  SubnetType,
  Vpc,
} from "aws-cdk-lib/aws-ec2";
import * as ecs from 'aws-cdk-lib/aws-ecs';
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
