import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

import { backendInstance } from './constructs/backendInstance';
import { deployment } from './constructs/deployment';
import { database } from './constructs/database';
import { frontend } from './constructs/frontend';

export class Stack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const front = new frontend (this, 'cloudfron');
    const backend = new backendInstance(this, 'dev_backend_ec2');
    const db = new database(this, 'database');

    const codedeployment = new deployment(this, 'code_deployment');



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
