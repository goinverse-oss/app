#!/usr/bin/env node

/*
 * Post a comment to the active pull request for this build, if any.
 */

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

const body = `
Commit ${vars.commit} deployed to Expo ([app](${appUrlWeb}), [storybook](${storybookUrlWeb})).

Scan with the [Expo app](https://expo.io/tools#client) (or the Camera app
on iOS 11) to load this build.

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
