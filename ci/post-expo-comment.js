#!/usr/bin/env node

/*
 * Post a comment to the active pull request for this build, if any.
 */

const querystring = require('querystring');
const octokit = require('@octokit/rest')();
const _ = require('lodash');

function getExpoUrl(commit) {
  return `https://expo.io/@theliturgists/app?release-channel=${commit}`;
}

function getQrCodeUrl(content) {
  const base = 'api.qrserver.com/v1/create-qr-code';
  const size = '200x200';
  return `https://${base}?size=${size}&data=${content}`;
}

function appetizeUrl(expoUrl, options = {}) {
  const base = 'https://appetize.io/app';

  const defaultOptions = {
    device: 'iphone6s',
  };
  const queryParams = {
    ...defaultOptions,

    screenOnly: false,
    autoplay: false,
    embed: true,
    xdocMsg: true,
    xDocMsg: true,
    debug: true,
    deviceColor: 'black',
    orientation: 'portrait',
    launchUrl: expoUrl,
    params: JSON.stringify({
      EXKernelLaunchUrlDefaultsKey: expoUrl,
      EXKernelDisableNuxDefaultsKey: true,
    }),
    scale: 75,

    ...options,
  };
  const query = querystring.stringify(queryParams);

  const expoPublicKeys = {
    ios: '8bnmakzrptf1hv9dq7v7bnteem',
    android: 'xc1w6f1krd589zhp22a0mgftyw',
  };
  const { device } = queryParams;
  let expoPublicKey;
  if (device.indexOf('iphone') === 0) {
    expoPublicKey = expoPublicKeys.ios;
  } else if (device.indexOf('nexus') === 0) {
    expoPublicKey = expoPublicKeys.android;
  } else {
    throw Error(`Unrecognized device type: ${device}`);
  }
  return `${base}/${expoPublicKey}?${query}`;
}

if (!process.env.CIRCLE_PR_NUMBER && !process.env.CIRCLE_PULL_REQUEST) {
  // not a PR build; exit
  console.log('Not a PR build; skipping comment');
  process.exit(0);
}

const requiredEnvVars = {
  token: 'GH_WRITE_COMMENTS_AUTH_TOKEN',
  repo: 'CIRCLE_PROJECT_REPONAME',
  commit: 'CIRCLE_SHA1',
};

const vars = _.mapValues(requiredEnvVars, (name) => {
  if (!process.env[name]) {
    console.error(`Missing required env variable: '${name}'`);
    process.exit(1);
  }
  return process.env[name];
});

// CircleCI docs say that CIRCLE_PR_NUMBER should be defined,
// but it's not. Work around it by pulling the number
// off the end of the CIRCLE_PULL_REQUEST url instead.
vars.prnum = process.env.CIRCLE_PR_NUMBER;
if (!vars.prnum) {
  vars.prnum = process.env.CIRCLE_PULL_REQUEST.split('/').pop();
}
vars.prnum = parseInt(vars.prnum, 10);

octokit.authenticate({
  type: 'token',
  token: vars.token,
});

const appUrlWeb = getExpoUrl(vars.commit);
const appUrl = appUrlWeb.replace('https', 'exp');
const storybookUrlWeb = getExpoUrl(`storybook-${vars.commit}`);
const storybookUrl = storybookUrlWeb.replace('https', 'exp');
const appQR = getQrCodeUrl(appUrl);
const storybookQR = getQrCodeUrl(storybookUrl);

const iosOptions = { device: 'iphone6s' };
const androidOptions = { device: 'nexus5' };
const urls = {
  ios: {
    app: appetizeUrl(appUrl, iosOptions),
    storybook: appetizeUrl(storybookUrl, iosOptions),
  },
  android: {
    app: appetizeUrl(appUrl, androidOptions),
    storybook: appetizeUrl(storybookUrl, androidOptions),
  },
};

const expoBlogUrl =
  'https://blog.expo.io/upcoming-limitations-to-ios-expo-client-8076d01aee1a';

const body = `
Commit ${vars.commit} deployed to Expo.

Open a simulator in your browser:

| Platform |   |   |
| -------- | - | - |
| iOS      | [app](${urls.ios.app})     | [storybook](${urls.ios.storybook}) |
| Android  | [app](${urls.android.app}) | [storybook](${urls.android.storybook}) |

Scan with the [Expo app](https://expo.io/tools#client) ([Android only](${expoBlogUrl})) to load this build.

| <h3>app</h3>  | <h3>storybook</h3>  |
| ------------- | ------------------- |
| ![](${appQR}) | ![](${storybookQR}) | 
`;

console.log(`Posting comment to theliturgists/app#${vars.prnum}`);

// Per the docs, we use the issues API (not the pull requests API)
// to add general, non-review, non-commit comments to a PR.
octokit.issues.createComment({
  owner: 'theliturgists',
  repo: vars.repo,
  number: vars.prnum,
  body,
})
  .then(() => console.log('Done.'))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
