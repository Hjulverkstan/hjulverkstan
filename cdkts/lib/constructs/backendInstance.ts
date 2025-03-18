import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as path from 'path';
import { Construct } from 'constructs';
import { CfnOutput } from 'aws-cdk-lib/core';
import * as apig from 'aws-cdk-lib/aws-apigateway';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';

export interface IngressRule {
  peer: ec2.IPeer;
  connection: ec2.Port;
  description?: string;
}

export class backendInstance {
  public instance: ec2.Instance;

  // constructor(scope: Construct, id: string, certificate:  certificatemanager.ICertificate , hostedZone: route53.IHostedZone) {
  constructor(scope: Construct, id: string ,  certificate:  certificatemanager.ICertificate,  hostedZone: route53.IHostedZone,props?: cdk.StackProps) {


     // ✅ VPC
     const vpc = new ec2.Vpc(scope, 'Vpc', {
      maxAzs: 1, 
      natGateways: 0, // No NAT gateway since we need public access
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: 'PublicSubnet',
          subnetType: ec2.SubnetType.PUBLIC, // ✅ Ensure public subnet
        },
      ],
    });
     // ✅ Security Group
     const securityGroup = new ec2.SecurityGroup(scope, 'SecurityGroup', {
       vpc,
       description: 'Allow SSH and HTTP',
       allowAllOutbound: true,
     });
     securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');
     securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080), 'Allow HTTP');
 
     // ✅ IAM Role for EC2
     const role = new iam.Role(scope, 'Ec2InstanceRole', {
       assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
       managedPolicies: [
         iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
       ],
     });
 
     // ✅ EC2 Instance
     const instance = new ec2.Instance(scope, 'Instance', {
       vpc,
       instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
       machineImage: ec2.MachineImage.latestAmazonLinux(),
       securityGroup,
       role,
       keyName: 'my-key-pair', // Replace with your EC2 key pair
       vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC, // ✅ Ensures public IP is assigned
      },
     });

 
       // ✅ User Data Script - Installs Docker & Starts Service
       instance.addUserData(
        `#!/bin/bash`,
        `yum update -y`,
        `yum install -y docker`,
        `systemctl start docker`,
        `systemctl enable docker`
      );
 
     // ✅ Output Public IP of EC2
     new cdk.CfnOutput(scope, 'InstancePublicIp', {
      value: `http://${instance.instancePublicIp}:8080`,
      description: 'Access Java application via this URL',
    });


//  const domain = 'apits.hjulverkstan.org';
//     const apiDomain = new apig.DomainName(scope, 'ApiDomain', {
//       domainName: domain,
//       certificate,
//       endpointType: apig.EndpointType.EDGE,
//     });

//     const api = new apig.RestApi(scope, 'MyApiGateway', {
//       restApiName: 'My Service',
//       description: 'This service serves my API.',
//       domainName: {
//         domainName: domain,
//         certificate,
//       },
//     });

//     api.root.addMethod('GET', getWidgetsIntegration);

//     // Base Path Mapping for the API
//     new apig.BasePathMapping(scope, 'BasePathMapping', {
//       domainName: apiDomain,
//       restApi: api,
//       basePath: 'api', // The base path as specified
//     });
    // const hostedZone1 = route53.HostedZone.fromLookup(scope, 'ImportedHostedZone', {
    //   domainName: domain,
    // });

    // const zone = route53.PublicHostedZone.fromHostedZoneAttributes(scope, 'MyZone', {
    //     hostedZoneId: hostedZone1.hostedZoneId,
    //     zoneName: 'hjulverkstanv.org', // Change to your domain
    // });


    // Route 53 Record for API Gateway
    // new route53.ARecord(scope, 'ApiAliasRecord', {
    //   recordName: 'api',
    //   target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
    //   zone,
    // });

  }
}