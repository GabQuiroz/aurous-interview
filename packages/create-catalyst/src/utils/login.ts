/* eslint-disable no-await-in-loop */

import { confirm, input } from '@inquirer/prompts';
import chalk from 'chalk';

import { Https } from './https';
import { spinner } from './spinner';

const DEVICE_OAUTH_ENABLED = process.env.DEVICE_OAUTH_ENABLED ?? false;

const poll = async (auth: Https, deviceCode: string, interval: number, expiresIn: number) => {
  const intervalMs = interval * 1000;
  const expiresAtMs = expiresIn * 1000;
  const retries = expiresAtMs / intervalMs;

  for (let i = 0; i < retries; i += 1) {
    try {
      return await auth.checkDeviceCode(deviceCode);
    } catch (err) {
      // noop
    }

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  console.error(chalk.red('\nDevice code expired. Please try again.\n'));
  process.exit(1);
};

export const login = async (
  bigCommerceAuthUrl: string,
  storeHash?: string,
  accessToken?: string,
) => {
  if (storeHash && accessToken) {
    return { storeHash, accessToken };
  }

  const shouldLogin = await confirm({
    message: 'Would you like to connect to a BigCommerce store?',
  });

  if (!shouldLogin) {
    return { storeHash, accessToken };
  }

  if (!DEVICE_OAUTH_ENABLED) {
    console.log(
      [
        `\nPlease create an access token at ${chalk.cyan(
          `${bigCommerceAuthUrl}/deep-links/settings/api-accounts/create`,
        )} with the following scopes:`,
        `  - Content: ${chalk.yellow('modify')}`,
        `  - Information & settings: ${chalk.yellow('modify')}`,
        `  - Products: ${chalk.yellow('modify')}`,
        `  - Carts: ${chalk.yellow('read-only')}`,
        `  - Sites & routes: ${chalk.yellow('modify')}`,
        `  - Channel settings: ${chalk.yellow('modify')}`,
        `  - Storefront API customer impersonation tokens: ${chalk.yellow('manage')}\n`,
      ].join('\n'),
    );

    return {
      storeHash: await input({
        message: 'Enter your store hash',
        validate: (i) => (i.length > 0 ? true : 'Store hash is required'),
      }),
      accessToken: await input({
        message: 'Enter your access token',
        validate: (i) => (i.length > 0 ? true : 'Access token is required'),
      }),
    };
  }

  const auth = new Https({ bigCommerceAuthUrl });

  const deviceCode = await auth.getDeviceCode();

  console.log(
    [
      `\nPlease visit ${chalk.cyan(deviceCode.verification_uri)} and enter the code: ${chalk.yellow(
        deviceCode.user_code,
      )}\n`,
      `The code will expire in ${chalk.yellow(`${deviceCode.expires_in / 60} minutes`)}\n`,
    ].join('\n'),
  );

  const { store_hash, access_token } = await spinner(
    poll(auth, deviceCode.device_code, deviceCode.interval, deviceCode.expires_in),
    {
      text: 'Waiting for device code to be authorized',
      successText: 'Device code authorized',
      failText: 'Device code expired',
    },
  );

  return {
    storeHash: store_hash,
    accessToken: access_token,
  };
};
