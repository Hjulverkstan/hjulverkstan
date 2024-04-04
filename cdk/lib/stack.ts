import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import { Construct } from 'constructs';

export class EcsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      maxAzs: 3
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc
    });

    new ecs_patterns.ApplicationLoadBalancedFargateService(this, "FargateService", {
      cluster: cluster,
      cpu: 256,
      desiredCount: 6,
      taskImageOptions: {image: ecs.ContainerImage.fromRegistry("amazon/amazon-ecs-sample")},
      memoryLimitMiB: 2048,
      publicLoadBalancer: true
    })
  }
}

