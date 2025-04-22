import * as path from 'node:path';
import { config } from 'dotenv';

// Load env vars from .env file
config({ path: path.resolve(__dirname, '../../.env') });

// These are the environment variables that needs to be provided by the root
// .env file, see README for guide.

interface EnvVars {
  /* Account used for deploy */
  CDK_ACCOUNT: string;
  /* A*/
  CDK_APEX_DOMAIN: string;
  CDK_SITE_CERT_ARN: string;
  CDK_SITE_RECORD_NAME: string;
}

export interface EnvConfig {
  account: string;
  apexDomain: string;
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
 * Also takes the stack 'app' | 'cert' as arg for validation of the
 * environment variables.
 */

export const createEnvConfig = (stack: string): EnvConfig => {
  // Account for the env vars

  const {
    CDK_ACCOUNT,
    CDK_APEX_DOMAIN,
    CDK_SITE_CERT_ARN,
    CDK_SITE_RECORD_NAME,
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

  if (stack === 'app' && !CDK_SITE_CERT_ARN) {
    throw new Error(`CDK_SITE_CERT_ARN is needed when stack=app, see README.`);
  }

  // Set up config

  const account = CDK_ACCOUNT;
  const apexDomain = CDK_APEX_DOMAIN;

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
