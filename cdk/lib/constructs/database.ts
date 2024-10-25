import * as cdk from 'aws-cdk-lib';
import { InstanceClass, InstanceSize, InstanceType, SubnetType, Vpc } from "aws-cdk-lib/aws-ec2";
import { Credentials, DatabaseInstance, DatabaseInstanceEngine, PostgresEngineVersion } from 'aws-cdk-lib/aws-rds';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib/core';



export class database {


  constructor(scope: Construct , id: string) {
    const engine = DatabaseInstanceEngine.postgres({ version: PostgresEngineVersion.VER_16_2 });
    const instanceType = InstanceType.of(InstanceClass.T3, InstanceSize.MICRO);
    const vpc = new Vpc(scope, "Vpc", {
      maxAzs: 2
    });
    // Define database credentials
    const availabilityZone = 'eu-north-1a';
    const dbUsername = 'postgres';
    const dbPassword = cdk.SecretValue.unsafePlainText('secretpass');

    // Create RDS instance
    const rdsInstance =new DatabaseInstance(scope, 'PostgresDB', {
      engine,
      instanceType,
      vpc,
      vpcSubnets: { subnetType: SubnetType.PRIVATE_WITH_EGRESS },
      credentials: Credentials.fromUsername(dbUsername, { password: dbPassword }),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      availabilityZone: availabilityZone,
    });

    new CfnOutput(scope, 'DbEndpoint', {
      value: rdsInstance.dbInstanceEndpointAddress, // The endpoint address
      description: 'The endpoint address of the Postgres database',
    });


  }




}