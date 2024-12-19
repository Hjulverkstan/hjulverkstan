import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
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
  constructor(scope: Construct, id: string ,  certificate:  certificatemanager.ICertificate,  hostedZone: route53.IHostedZone) {

    const vpc = new ec2.Vpc(scope, 'MyVpc', { maxAzs: 1 });
    const instanceType = ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MEDIUM);
    const keyPair = ec2.KeyPair.fromKeyPairName(scope, 'KEYPAIR', 'awsbikejeus');
    const securityGroup = new ec2.SecurityGroup(scope, 'MySecurityGroup', {
      vpc,
      allowAllOutbound: true,
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH access');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(8080), 'Allow 8080 access to the service');


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

    const ec2CodeDeployRole = new iam.Role(scope, 'CodeDeployRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSCodeDeployRole'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AmazonEC2RoleforSSM'),
      ],
    });


    const backendInstance = new ec2.Instance(scope, 'dev_backend_ec2', {
      instanceType: instanceType,
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PUBLIC,
      },
      securityGroup,
      keyPair: keyPair,
      userData: ec2.UserData.custom(userDataScript),
      associatePublicIpAddress: true,
      role: ec2CodeDeployRole,
    });

    new CfnOutput(scope, 'InstancePublicIp', {
      value: backendInstance.instancePublicIp,
      description: 'Public IP of the EC2 instance',
    });


    //###########################API_GATEWAY
    const getWidgetsIntegration = new apig.HttpIntegration(
      `http://${backendInstance.instancePublicDnsName}:8080/v1`,
    );










 const domain = 'api.hjulverkstan.org';
    const apiDomain = new apig.DomainName(scope, 'ApiDomain', {
      domainName: domain,
      certificate,
      endpointType: apig.EndpointType.EDGE,
    });

    const api = new apig.RestApi(scope, 'MyApiGateway', {
      restApiName: 'My Service',
      description: 'This service serves my API.',
      domainName: {
        domainName: domain,
        certificate,
      },
    });

    api.root.addMethod('GET', getWidgetsIntegration);

    // Base Path Mapping for the API
    new apig.BasePathMapping(scope, 'BasePathMapping', {
      domainName: apiDomain,
      restApi: api,
      basePath: 'api', // The base path as specified
    });
    const hostedZone1 = route53.HostedZone.fromLookup(scope, 'ImportedHostedZone', {
      domainName: domain,
    });

    const zone = route53.PublicHostedZone.fromHostedZoneAttributes(scope, 'MyZone', {
        hostedZoneId: hostedZone1.hostedZoneId,
        zoneName: 'hjulverkstanv.org', // Change to your domain
    });


    // Route 53 Record for API Gateway
    new route53.ARecord(scope, 'ApiAliasRecord', {
      recordName: 'api',
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
      zone,
    });

  }
}