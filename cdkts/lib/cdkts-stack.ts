import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import { Construct } from 'constructs';
import { backendInstance } from './constructs/backendInstance';
import { deployment } from './constructs/deployment';
import { database } from './constructs/database';
import { frontend } from './constructs/frontend';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdktsStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const certificateArn = 'arn:aws:acm:us-east-1:730335549373:certificate/fb69c456-2156-460b-b579-99af11c9cead';
    const certificate = acm.Certificate.fromCertificateArn(this, 'ImportedCertificate', certificateArn);


    const hostedZoneId = 'Z06587302B0UA1QW934WE';
    const domainName = 'hjulverkstan.org';
    const hostedZone = route53.HostedZone.fromLookup(this, 'ImportedHostedZone', {
      domainName: domainName,
    });

    const front = new frontend (this, 'cloudfron' , certificate , hostedZone);
    const backend = new backendInstance(this, 'dev_backend_ec2',  certificate, hostedZone);
    const db = new database(this, 'database');
    const codedeployment = new deployment(this, 'code_deployment' , );
    // const apiGateway = new apigateway(this, 'code_deployment' , backend.instance);


    // TODO: need to implement for keeping our secrets like database and ...
    const secret = new secretsmanager.Secret(this, 'MySecret', {
      secretName: 'MyApp/MySecret',
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'user' }),
        generateStringKey: 'password',
      },
    });
  }
}
