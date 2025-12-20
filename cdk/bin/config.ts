import * as path from 'node:path';
import { config } from 'dotenv';

// Load env vars from .env file
config({ path: path.resolve(__dirname, '../../.env') });

// These are the environment variables that needs to be provided by the root
// .env file, see README for guide.

interface EnvVars {
  CDK_ACCOUNT: string;
  CDK_APEX_DOMAIN: string;
  /* Set to "ROOT" if prod / apex domain */
  CDK_SITE_RECORD_NAME: string;
  /**
   * Required only if root, pass delegations site record name (e.g dev,
   * test) and the list the name servers with comma, if multiple delegations
   are provided, separate them with semicolon, for instance:
   *   dev=ns-123.awsdns.com,ns-456.aws.com;test=ns-789...
   */
  CDK_ROOT_DELEGATED_NS: string;
  /* Only needed when reason=deploy */
  CDK_SITE_CERT_ARN: string;
  /* Only needed when reason=deploy */
  CDK_ROUTING_LAMBDA_ARN: string;
}

/* Site domain as key, name servers as value */
export interface SiteRootDelegation {
  recordName: string;
  nameServers: string[];
}

export interface EnvConfig {
  account: string;
  apexDomain: string;
  routingLambdaArn: string;
  siteCertArn: string;
  siteRecordName: string;
  siteRootDelegations: SiteRootDelegation[];
  siteDomain: string;
  sshRecordName: string;
  sshDomain: string;
  bucketSuffix: string;
  isProd: boolean;
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

const createSiteRootDelegations = (apexDomain: string, input: string) => {
  if (input.includes(' ') || input.includes(',,')) {
    throw new Error(`Invalid input for CDK_ROOT_DELEGATED_NS: ${input}`);
  }

  return input.split(';').map((input) => {
    const [delegationSiteName, nameServerInput] = input.split('=');

    return {
      recordName: resolveBySeparator('.', delegationSiteName, apexDomain),
      nameServers: nameServerInput.split(','),
    };
  });
};

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
    CDK_ROOT_DELEGATED_NS,
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

  if (
    reason === 'setup' &&
    CDK_APEX_DOMAIN === 'ROOT' &&
    !CDK_ROOT_DELEGATED_NS
  ) {
    throw new Error(
      `CDK_ROOT_DELEGATED_ZONE_NS is needed when reason=setup and CDK_APEX_DOMAIN=ROOT, see README.`,
    );
  }

  // Set up config

  const account = CDK_ACCOUNT;
  const apexDomain = CDK_APEX_DOMAIN;
  const routingLambdaArn = CDK_ROUTING_LAMBDA_ARN;

  const isProd = CDK_SITE_RECORD_NAME === 'ROOT';

  const siteCertArn = CDK_SITE_CERT_ARN;
  const siteRecordName = isProd ? '' : CDK_SITE_RECORD_NAME;
  const siteDomain = isProd
      ? apexDomain
      : resolveBySeparator('.', siteRecordName, apexDomain);

  const sshRecordName = 'ssh';
  const sshDomain = resolveBySeparator('.', sshRecordName, siteDomain);

  const bucketSuffix = resolveBySeparator('-', siteRecordName, account);

  const siteRootDelegations: SiteRootDelegation[] =
    isProd
      ? createSiteRootDelegations(apexDomain, CDK_ROOT_DELEGATED_NS)
      : [];

  // Export

  const config = {
    account,
    apexDomain,
    routingLambdaArn,
    siteCertArn,
    siteRecordName,
    siteDomain,
    siteRootDelegations,
    sshRecordName,
    sshDomain,
    bucketSuffix,
    isProd
  };

  console.log(`Successfully populated all config values`);
  console.log(config);

  return config;
};
