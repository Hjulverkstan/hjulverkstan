import * as path from 'node:path';
import { config } from 'dotenv';

// Load env vars from .env file
config({ path: path.resolve(__dirname, '../../.env') });

// These are the environment variables that needs to be provided by the root
// .env file, see README for guide.

interface EnvVars {
  CDK_ACCOUNT: string;
  CDK_APEX_DOMAIN: string;
  CDK_SITE_RECORD_NAME: string;
  /* Only needed when reason=deploy */
  CDK_SITE_CERT_ARN: string;
  /* Only needed when reason=deploy */
  CDK_ROUTING_LAMBDA_ARN: string;
}

export interface EnvConfig {
  account: string;
  apexDomain: string;
  routingLambdaArn: string;
  siteCertArn: string;
  siteRecordName: string;
  siteDomain: string;
  sshRecordName: string;
  sshDomain: string;
  bucketSuffix: string;
}

//

/**
 * Resolves for instance a qualified domain name from parts – removing empty
 * strings and cleaning up extra dots in each segment. But can take really
 * anything, slashes for file paths or dashes for bucket names...
 */

const resolveBySeparator = (separator: string, ...parts: string[]) =>
  parts
    .filter((p) => p && p.trim() !== '')
    .map((p) => p.replace(new RegExp(`^\${separator}+|\${separator}+$`), ''))
    .join(separator);

/**
 * Create the configuration values for the stacks from environment variables.
 *
 * Also takes the reason 'setup' | 'deploy' as arg for validation of the
 * environment variables.
 */

export const createEnvConfig = (reason: string): EnvConfig => {
  // Account for the env vars

  const {
    CDK_ACCOUNT,
    CDK_APEX_DOMAIN,
    CDK_SITE_RECORD_NAME,
    CDK_SITE_CERT_ARN,
    CDK_ROUTING_LAMBDA_ARN,
  } = process.env as unknown as EnvVars;

  Object.entries({
    CDK_ACCOUNT,
    CDK_APEX_DOMAIN,
    CDK_SITE_RECORD_NAME,
  }).forEach(([key, val]) => {
    if (val === undefined) {
      throw new Error(`Missing env var ${key}, see README.`);
    }
  });

  if (reason === 'deploy' && !CDK_SITE_CERT_ARN) {
    throw new Error(
      `CDK_SITE_CERT_ARN is needed when reason=deploy, see README.`,
    );
  }

  if (reason === 'deploy' && !CDK_ROUTING_LAMBDA_ARN) {
    throw new Error(
      `CDK_ROUTING_LAMBDA_ARN is needed when reason=deploy, see README.`,
    );
  }

  // Set up config

  const account = CDK_ACCOUNT;
  const apexDomain = CDK_APEX_DOMAIN;
  const routingLambdaArn = CDK_ROUTING_LAMBDA_ARN;

  const siteCertArn = CDK_SITE_CERT_ARN;
  const siteRecordName = CDK_SITE_RECORD_NAME;
  const siteDomain = resolveBySeparator('.', siteRecordName, apexDomain);

  const sshRecordName = resolveBySeparator('.', 'ssh', siteRecordName);
  const sshDomain = resolveBySeparator('.', sshRecordName, apexDomain);

  const bucketSuffix = resolveBySeparator('-', siteRecordName, account);

  // Export

  const config = {
    account,
    apexDomain,
    routingLambdaArn,
    siteCertArn,
    siteRecordName,
    siteDomain,
    sshRecordName,
    sshDomain,
    bucketSuffix,
  };

  console.log(`Successfully populated all config values`);
  console.log(config);

  return config;
};
