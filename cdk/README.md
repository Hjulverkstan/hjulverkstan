> Welcome to the aws architecture module of the Hjulverkstan monorepo, here is a [link](../README.md) to the main project readme.

This documentation pertains to both AWS's CDK and the GitHub Actions pipelines

## UML Diagram

<div>
    <img src="aws.drawio.svg">
</div>

## Background

This repository uses **Infrastructure as Code (IaC)** via **AWS CDK (TypeScript)**. The infrastructure is deployed in two explicit phases, controlled by a CDK context variable:

- `reason=setup` — long‑lived prerequisites and global resources
- `reason=deploy` — environment‑specific application infrastructure

This separation keeps cross‑region and cross‑account dependencies explicit and manageable.

The system is designed for **multiple AWS accounts** (recommended):

- **prod** owns the apex domain and DNS authority (`hjulverkstan.se`)
- **dev / staging** own delegated sub‑domains:
    - `dev.hjulverkstan.se`
    - `staging.hjulverkstan.se`

## Setup

Install dependencies:

```bash
npm i
```

Build the JS output:

```bash
npm run build
```

Setup AWS CLI login:

1. Create a user in the root account add to identity center.
2. From there add all the required hjulverkstan environment accounts to the user.
3. Run `aws configure sso` on the development machine.
4. In the prompt create a name (you will reuse this) and paste the URL from the SSO console.
5. Accept default role, region and output format.
6. Select, in the dropdown menu the account you want to add (for instance the dev environment account).
7. Then name a simple name for the profile name (e.g. `hjul-dev` etc) as this will be reused throughout the deployment process.
8. Then for each other environment account you want to add, run `aws configure sso` again and by writing the same name you defined in step 4, you will be able to repeat step 6. and 7.
9. Now you can, for all the coming cdk commands in this readme add `--profile <profile name>` to point to the correct account, where profile name is the name you defined in step 7.

> Note that with SSO you will need to periodically authenticate youself as the is no longterm credentials stored, do this with `aws sso login --profile <profile name>`

## Deployment Phases Overview

The infrastructure is deployed in **two explicit phases** to keep dependencies clear, repeatable, and easy to reason about.

The key idea is simple:

> Some parts of the infrastructure produce **values (ARNs and DNS data)** that other parts depend on. Those values must exist before the application stacks can be deployed.

In particular, CloudFormation cannot directly reference resources that live in **other regions** (or were created earlier in a separate stack). Instead, those resources must be referenced by their **ARNs**, which only exist after the resources have been created.

Because of this, the infrastructure is split into an explicit setup step that creates these resources and exposes their ARNs, followed by a deploy step that consumes them via environment variables.

### Setup phase (`reason=setup`)

This phase creates all **foundational resources** that other stacks depend on:

- DNS infrastructure (hosted zones and delegations)
- Lambda@Edge function
- ACM certificate for the site

This step prints outputs that are needed later (such as certificate ARNs, Lambda version ARNs, and name servers).

### Deploy phase (`reason=deploy`)

This phase creates the **environment-specific application infrastructure**, using the values produced during setup:

- VPC, EC2 instance, and security groups
- S3 buckets
- CloudFront distribution
- Route 53 records inside the environment’s hosted zone

By separating setup from deploy, the system stays predictable, avoids hidden cross-stack dependencies, and makes it safe to re-run deployments without recreating global or shared resources.

## Required Environment Variables

### Common, both setup and deploy (all environments)

- `CDK_ACCOUNT` — AWS account ID
- `CDK_APEX_DOMAIN` — hosted zone & site domain
- `CDK_SITE_RECORD_NAME` — record name inside the zone (`"ROOT"` for apex, if prod, otherwise `"dev"`, etc.)

### Deploy‑only variables

Required when running `reason=deploy`:

- `CDK_SITE_CERT_ARN` — output from `CertStack`
- `CDK_ROUTING_LAMBDA_ARN` — output from `LambdaStack`

And if prod, ie ``CDK_SITE_RECORD_NAME="ROOT"``:A

- `CDK_ROOT_DELEGATED_NS_` – output from `DnsEnvStack`, contains the name servers for each environment. Each environent / delegation is specified with the site record name as the key and the name servers as comma separated list, each delegation separated by semicolon. Example:
  `dev=ns-123.awsdns.com,ns-456.aws.com;test=ns-123.awsdns.com,ns-456.aws.com`

These values are printed during `reason=setup`.

## Creating the infrastructure from scratch

This section shows the minimal flow to get **prod + dev + test** running.

With the SSO environments setup in ([Setup](#setup)) you will need to add `--profile <profile name>` to each cdk command depending on the environemnt you are targeting.

### 1) First run: create DNS zones in dev and test

For **dev** and **test** accounts run:

```bash
cdk bootstrap -c reason=setup
cdk deploy -c reason=setup DnsStack
```

Copy the output `DelegatedZoneNameServers`.

### 2) Second run: create zones and delegate dev/test environments in prod 

Set `CDK_ROOT_DELEGATED_NS` using the values copied from the previous step, see [Deploy‑only variables](#deploy‑-only-variables) for more info on formatting, then towards the prod account:

```bash
cdk bootstrap -c reason=setup
cdk deploy -c reason=setup DnsStack
```

This creates NS records in the apex zone (`hjulverkstan.se`) delegating `dev` and `test`.

All DNS configuration is now complete.

### 3) Third run: complete setup in all environments 

Now that delegation exists, you can run full setup in all the environments to get the needed resource numbers (ARN) that the application stacks require.

```bash
cdk deploy -c reason=setup --all
```

Copy the printed outputs for:

- `CDK_SITE_CERT_ARN`
- `CDK_ROUTING_LAMBDA_ARN`

### 4) Final run: Application stacks in all environments 

For each environment run, with the correct environment variables populated:

```bash
cdk bootstrap -c reason=deploy --all
cdk deploy -c reason=deploy --all
```

### 5) Setup SSH access to EC2 instance

First, inside the AWS console connect to the instance and run:

```
cd /opt/docker
sh create-ssh-user.sh
```

And define your personal username and paste you SSH public key.

Once this is done you may ssh into the instance from your local machine, the ssh address is printed in the beginning of the output of the `cdk deploy` command, it is `ssh.` + the domain of the environment.

You may check if the result of the user-data cloud init script on ec2 instance creation:

```bash
sudo less /var/log/cloud-init-output.log
```

The output of the `ec2-assetss/setup.sh` script is also good to check:

```bash
sudo less /var/log/setup.log
```

You will also need to create a key for the pipeline as we will soon need to run the pipeline against the environments. On what ever machine, generate an ssh key pair and save private key somewhere for now (will be added to the secrets management of the pipeline in a later step) and paste the public key into the `crete-ssh-user.sh` script as you generate a user for the pipeline, proposedly with the username `pipeline`.

> All ec2 instances of the environments are lacking the environment variables needed to run. While the spring application does not need to be pushed directly to the EC2 instance (as this is pulled by docker-compose from the docker registry), the frontend does need to be pushed to the site bucket.

### 6) Setup environent variables and secrets in GitHub Actions

For a specification of the exact variables see [GitHub Actions](#github-actions).

The `DOCKER_` variables may be on repo level, but the others are per environment.

From the previous steps we have:

- AWS access and secret key used both by `DEPLOY_` and `API_AWS_`
- SSH key, host and user used by `DEPLOY_`
- Site bucket name used by `DEPLOY_`
- Images bucket name used by `API_`

The cloudfront distribution id for `DEPLOY_` currently has to be retrieved from the AWS console.

The other `VITE_` and `API_` variables may be extrapolated from the `.env.template` no more details guide exists at the moment.

### 7) Trigger pipeline

When triggering choose (both) instead of auto as there may not be any commits to trigger both the web and api pipelines.

As of now there is no strategy for the spring applicatino to prepelry initialise the database, it is therefore expected that the pipeline fails on the build and deploy web stage. To remedy this, once at least the api_deploy step has completed, add these two env vars to `/opt/docker/.env`:

```sh
SPRING_JPA_HIBERNATE_DDL_AUTO=update
SPRING_SQL_INIT_MODE=always
```

Restart the api container:

```
docker compose down && docker compose up
```

Comment out the added env vars (important!), and rerun the pipeline.

## Important Notes

Working with CDK has its value being a tool for Infrastructure as Code, however CloudFormation, which CDK leverages under the hood is in many ways old and can be hard to introspect when something goes wrong. Especially if there are resource conflicts.

### Duplicate buckets

During the creation phase of a stack, lets say it fails to fully build the stack, buckets may still be created and will not be removed in the rollback. The next time you try to deploy the configuration of the change set will fail, but, without any valiable insight as to what. This seems to be the case when it comes to change set issues – that you often cant figure out what is wrong. Keep this in mind, other resources such as roles etc are sucessfully deleted in the rollback....

### Secrets not part of IaC

Some secrets are required for the application to run, as well as for the pipeline to execute the aws cli. For this one currently has to create a user in the environments AWS account and add the required permissions (as of now S3 read + write, cloudfront invalidate and SNS), this JSON has been used for now:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "S3ReadWriteAll",
      "Effect": "Allow",
      "Action": [
        "s3:ListAllMyBuckets",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:AbortMultipartUpload",
        "s3:ListMultipartUploadParts",
        "s3:ListBucketMultipartUploads"
      ],
      "Resource": "*"
    },
    {
      "Sid": "SnsPublishSms",
      "Effect": "Allow",
      "Action": [
        "sns:Publish",
        "sns:SetSMSAttributes",
        "sns:GetSMSAttributes"
      ],
      "Resource": "*"
    },
    {
      "Sid": "CloudFrontInvalidation",
      "Effect": "Allow",
      "Action": [
        "cloudfront:CreateInvalidation",
        "cloudfront:GetInvalidation",
        "cloudfront:ListInvalidations"
      ],
      "Resource": "*"
    }
  ]
}
```

### Manual installation of docker-compose

In the `ec2-assetts/setup.sh` we manually install docker-compose with curl against github releases. This can fail – so make sure that docker compose is working properly or there will be failures...

### Manual sql init on first run of ec2 instance

Right now

## GitHub Actions

### Required Secrets

**Docker / build:**

- `DOCKER_USERNAME`
- `DOCKER_PASSWORD`

**Deployment:**

- `DEPLOY_API_SSH_HOST`
- `DEPLOY_API_SSH_USER`
- `DEPLOY_API_SSH_KEY`
- `DEPLOY_ACCESS_KEY`
- `DEPLOY_SECRET_KEY`

### Required Variables

- `DOCKER_REPO` — Docker Hub repo (e.g. `anorden/hjulverkstan-api`)
- `DOCKER_API_IMAGE_TAG` — `dev-release`, `test-release`, `release`
- `DEPLOY_WEB_BUCKET_NAME` — from `SiteBucket`
- `DEPLOY_WEB_CLOUDFRONT_DISTRIBUTION_ID` — CloudFront ID

The pipelines also require **all env vars prefixed with**:

- `API_`
- `VITE_`

These are injected during build and copied to the EC2 instance for Docker Compose.

See `.env.template` for the full list.

