# Welcome to your CDK TypeScript project

> Welcome to the aws architecture module of the Hjulverkstan monorepo, here is a [link](../README.md) to the main project readme.

## Background

### Architecture 

`TODO: Talk about infra as code`

`TODO: Fill in more about the approach used with CDK`

`TODO: Svg diagram from draw.io saved with editability`

`TODO: Talk about how we use ec2 and docker compose`

`TODO: Talk about the idea behind environments and pipelines, docker releases, trunk based development etc.`

A brief comment regarding the CI/CD and local deploy is that the env vars for ec2 and the starting of docker compose is not part of the setup.sh script that the ec2 runs upon cdk deployment.

This is thought to be a separate pipeline stage to be run after, the deploy env vars run docker-compose down and up.

And during local deployment by developer one has to scp the .env file into place, that is `/opt/docker/.env`...

The env vars that are needed to run docker-compose is all the env-vars that are prefixed with `API`


## Guide

### Setup

Install dependencies

```bash
npm i
```

Build the .js files

```bash
npm run build
```

### Certificate Stack

This stack is for manual deployment by developer, it creates the global certificate used by CloudFront and outputs the ARN id to the console that is needed for the App Stack.

Required environment variables to be populated directly in bash or in the root .env (recommended, you can copy the root .env.templates and fill in values):

- `CDK_ACCOUNT`: Your aws account with deploy permissions
- `CDK_APEX_DOMAIN`: The apex domain of the site, that is the root domain without subdomains, i.e `hjulverkstan.org`
- `CDK_SITE_RECORD_NAME`: This is the subdomain to publish the site to, i.e. `dev` or just `""` empty string for prod. 

Bootstrap and deploy

```bash
cdk bootstrap -c stack=cert
cdk deploy -c stack=cert
```

### App Stack

This is the stack of the application, to be automatically deployed by CI/CD but should naturally be manually deployed for testing when making changes to the stack.

Required environment variables to be populated directly in bash or in the root .env (recommended, you can copy the root .env.templates and fill in values):

- `CDK_ACCOUNT`: Your aws account with deploy permissions
- `CDK_APEX_DOMAIN`: The apex domain of the site, that is the root domain without subdomains, i.e `hjulverkstan.org`
- `CDK_SITE_RECORD_NAME`: This is the subdomain to publish the site to, i.e. `dev` or just `""` empty string for prod.
- `CDK_SITE_CERT_ARN`: This is the ARN exposed when running the Cert Stack.

Bootstrap and deploy, with both sub-stack using --all:

```bash
cdk bootstrap -c stack=app
cdk bootstrap -c stack=app --all
```

### Adding users with ssh access to the server

Through the aws ec2 console or if you already have ssh access:

```bash
cd /opt/docker
sh create-ssh-user.sh
```

This will prompt for username and ssh key and will resolve ssh access, user groups and sudoer rights...