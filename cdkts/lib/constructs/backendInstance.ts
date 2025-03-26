import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as certificatemanager from 'aws-cdk-lib/aws-certificatemanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as customResources from 'aws-cdk-lib/custom-resources';

export interface IngressRule {
  peer: ec2.IPeer;
  connection: ec2.Port;
  description?: string;
}

export class backendInstance {
  public instance: ec2.Instance;

  // constructor(scope: Construct, id: string, certificate:  certificatemanager.ICertificate , hostedZone: route53.IHostedZone) {
  constructor(scope: Construct, id: string ,  certificate:  certificatemanager.ICertificate,  hostedZone: route53.IHostedZone,props?: cdk.StackProps) {


    const subdomain = "www.api.dev.hjulverkstan.org";
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
     securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP');
     securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS');
     securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080), 'Allow App Traffic');
 
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
       machineImage: ec2.MachineImage.latestAmazonLinux2023(),
       role,
       keyName: 'ec-putty-key', // Replace with your EC2 key pair
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
        'sudo systemctl enable docker',
        'sudo usermod -aG docker ec2-user',
        'curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-linux-x86_64" -o /usr/local/bin/docker-compose',
        'chmod +x /usr/local/bin/docker-compose',
        'docker-compose --version'
      );
 
     // ✅ Output Public IP of EC2
     new cdk.CfnOutput(scope, 'InstancePublicIp', {
      value: `http://${instance.instancePublicIp}:8080`,
      description: 'Access Java application via this URL',
    });

    // ✅ Create an A record in Route 53 to map the subdomain to the EC2 instance
    new route53.ARecord(scope, 'ApiDevSubdomainRecord', {
      recordName: subdomain, // The subdomain name
      target: route53.RecordTarget.fromIpAddresses(instance.instancePublicIp), // Point to EC2 public IP
      zone: hostedZone, // The hosted zone where the domain is managed
    });


    // Verification for subdomain record creation
    new cdk.CfnOutput(scope, 'SubdomainRecordVerification', {
      value: `Subdomain 'api-dev.hjulverkstan.org' created and pointing to IP: ${instance.instancePublicIp}`,
    });
  }
}