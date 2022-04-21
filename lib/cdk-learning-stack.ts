import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

import * as cdk from '@aws-cdk/core';
import * as rds from 'aws-cdk-lib/aws-rds';




// CHANGE: This is where you import the classes from the module:
//import { Vpc, SubnetType } from '@aws-cdk/aws-ec2';
import { Vpc, SubnetType } from 'aws-cdk-lib/aws-ec2';
import { S3 } from 'aws-cdk-lib/aws-ses-actions';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { CfnOutput } from 'aws-cdk-lib';

export class CdkLearningStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    const vpc = new Vpc(this, 'MainVpc',{
      maxAzs: 2,        
        subnetConfiguration:  [
          {
            cidrMask: 24,
            name: 'public-subnet',
            subnetType: SubnetType.PUBLIC
          },          
          {
            cidrMask: 24,
            name: 'private-subnet',  
            subnetType: SubnetType.PRIVATE_ISOLATED
          },
        ]
      });

      const bucket = new Bucket(this, 'MyBucket',{
        websiteIndexDocument: 'index.html',
        bucketName: 'chrisbratlien-growthdays-2022',
        enforceSSL: true,
        publicReadAccess: false,
        //encryption: BucketEncryption.S3_MANAGED
      });
      new CfnOutput(this, 'WebAppURL', {
        value: 'https://' + bucket.bucketDomainName + '/index.html',
        description: 'The URL of our web app',
        exportName: 'WebAppURL',
      });



      const engine = rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_12_9 });
      new rds.DatabaseInstance(this, 'InstanceWithUsername', {
        engine,
        vpc,
        credentials: rds.Credentials.fromGeneratedSecret('postgres'), // Creates an admin user of postgres with a generated password
        vpcSubnets: {
          subnetType: SubnetType.PRIVATE_ISOLATED
        }
      });


  }
}
