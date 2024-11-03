import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cdk from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as codedeploy from 'aws-cdk-lib/aws-codedeploy';
import { Construct } from 'constructs';
export class deployment {

  constructor(scope: Construct, id: string) {

    const codeDeployBucket = new s3.Bucket(scope, 'dev_codeDeploy_bucket', {
      versioned: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // Set to RETAIN for production
    });


    const codeDeployRole = new iam.Role(scope, 'dev_codeDeploy_role', {
      assumedBy: new iam.ServicePrincipal('codedeploy.amazonaws.com'),
    });

    codeDeployRole.addToPolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      resources: [codeDeployBucket.bucketArn],
      actions: ['s3:GetObject', 's3:ListBucket'],
    }));

    codeDeployRole.addToPolicy(
      new
      iam
        .PolicyStatement({
          effect: iam.Effect.ALLOW,
          resources: ['*'], // You might want to restrict this further
          actions: [
            'cloudwatch:PutMetricData',
            'logs:CreateLogGroup',
            'logs:CreateLogStream',
            'logs:PutLogEvents',
            'ec2:DescribeInstances',
            'codedeploy:*',
          ],
        }),
    );

    codeDeployRole.addManagedPolicy(iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSCodeDeployRole'));

    // Create a CodeDeploy application
    const codeDeployApp = new codedeploy.CfnApplication(scope, 'dev_back_codedeploy', {
      applicationName: 'dev_back_bike_application',
      computePlatform: 'Server' // For EC2 instances
    });

    // Create a CodeDeploy deployment group
    const codeDeploy = new codedeploy.CfnDeploymentGroup(scope, 'dev_back_deploymentgroup', {
      applicationName: codeDeployApp.applicationName as string,
      deploymentGroupName: 'dev_back_deploymentgroup_name',
      serviceRoleArn: codeDeployRole.roleArn,
      ec2TagFilters: [{
        key: 'Name', // Tag the instance with a name
        value: 'Dev-Stack/dev_backend_ec2',
        type: 'KEY_AND_VALUE'
      }]
    });

  }
}