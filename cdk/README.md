# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template

# Infrastructure for hjulverkstan.org with React App and PostgreSQL Database (Markdown)
This document describes the infrastructure deployed using AWS CDK for hjulverkstan.org. The infrastructure consists of the following components:

## Amazon S3 Bucket: 
A versioned S3 bucket named stack-s3 is created for potentially storing React application assets.
## Amazon ECS Cluster:
 An Amazon ECS cluster is created to run containerized applications.
## Amazon CloudFront Distribution:
 A CloudFront distribution is created to serve content from the S3 bucket with a custom domain name (hjulverkstan.org) using an existing SSL certificate.
## Amazon Route 53 Hosted Zone:
 An alias record is created in an existing Route 53 hosted zone (Z06587302B0UA1QW934WE, hjulverkstan.org) to point to the CloudFront distribution.
## Amazon RDS Database:
 A PostgreSQL database instance is created with the username postgres and a secret password (secretpass) stored in AWS Secrets Manager (not recommended for production environments).
## Important Note:
 Storing the database password in plain text in AWS Secrets Manager is not recommended for production environments. Consider using a more secure approach such as AWS Secrets Manager with KMS encryption.

# Code Breakdown
The provided code defines a CDK stack that creates the infrastructure resources mentioned above. Here's a breakdown of the code:

##  Imports:
 The code imports necessary libraries from the aws-cdk-lib and its submodules for working with various AWS services.

## Stack Definition:
 The Stack class extends the CDK Stack class and defines the infrastructure resources.
## Database Configuration: 
Defines the database engine (PostgreSQL) and instance type (t3.micro).
## VPC Creation:
 Creates a VPC with a maximum of two Availability Zones.
## ECS Cluster Creation:
 Creates an ECS cluster within the VPC to run containerized applications.
## S3 Bucket Creation:
 Creates a versioned S3 bucket with strong security configurations.
## Hosted Zone and Certificate Import:
 Imports an existing Route 53 hosted zone and an SSL certificate from their respective ARNs.
## CloudFront Distribution:
 Creates a CloudFront distribution that serves content from the S3 bucket with a custom domain and uses the imported SSL certificate.
## Route 53 Alias Record:
 Creates an alias record in the imported hosted zone that points to the CloudFront distribution.
## Database Instance Creation:
 Creates a PostgreSQL database instance within the VPC with the defined configuration and credentials.
## Fargate Service Definition:
 (Commented out) Defines a Fargate service with 6 tasks running the amazon/amazon-ecs-sample image. This section is currently commented out.
## Note:
 The Fargate service definition is currently commented out in the provided code. Uncommenting it will deploy a sample application using Amazon ECS.

This markdown document provides a high-level overview of the infrastructure created by the CDK code.